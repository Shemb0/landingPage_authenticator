import os
import tempfile
from django.conf import settings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.tools import tool
from langchain_community.chat_message_histories import ChatMessageHistory
from langgraph.prebuilt import create_react_agent
from .prompts import AGENT_PROMPTS
from .calendar_service import get_available_slots, create_event

_retriever = None


def get_retriever():
    global _retriever
    chroma_dir = settings.CHROMA_DIR
    if os.path.exists(chroma_dir) and os.listdir(chroma_dir):
        embedding = OpenAIEmbeddings()
        db = Chroma(persist_directory=chroma_dir, embedding_function=embedding)
        _retriever = db.as_retriever(search_kwargs={"k": 3})
    return _retriever


def index_pdf_from_bytes(pdf_bytes: bytes):
    """Index a PDF from bytes into Chroma vector store."""
    with tempfile.NamedTemporaryFile(suffix=".pdf", delete=False) as tmp:
        tmp.write(pdf_bytes)
        tmp_path = tmp.name

    try:
        loader = PyPDFLoader(tmp_path)
        documents = loader.load()

        splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
            chunk_size=800,
            chunk_overlap=100,
            add_start_index=True,
        )
        chunks = splitter.split_documents(documents)

        chroma_dir = settings.CHROMA_DIR
        embeddings = OpenAIEmbeddings()

        if os.path.exists(chroma_dir) and os.listdir(chroma_dir):
            db = Chroma(persist_directory=chroma_dir, embedding_function=embeddings)
            db.add_documents(chunks)
        else:
            db = Chroma.from_documents(
                chunks,
                embedding=embeddings,
                persist_directory=chroma_dir,
            )

        global _retriever
        _retriever = db.as_retriever(search_kwargs={"k": 3})
        return len(chunks)
    finally:
        os.unlink(tmp_path)


@tool
def check_available_slots(date: str) -> str:
    """
    Consulta los horarios disponibles para agendar una cita en una fecha dada.
    El parametro date debe estar en formato YYYY-MM-DD.
    Retorna una lista de horarios disponibles en formato HH:MM.
    """
    slots = get_available_slots(date)
    if not slots:
        return f"No hay horarios disponibles para el {date}."
    return f"Horarios disponibles para el {date}: {', '.join(slots)}"


@tool
def book_appointment(date: str, hour: str, client_name: str, client_surname: str, phone: str, reason: str) -> str:
    """
    Registra una cita en Google Calendar y en la base de datos.
    Parametros:
    - date: fecha en formato YYYY-MM-DD
    - hour: hora en formato HH:MM
    - client_name: nombre del cliente
    - client_surname: apellido del cliente
    - phone: telefono del cliente
    - reason: motivo de la cita
    """
    from app.citas.models import Citas
    from datetime import datetime

    result = create_event(date, hour, client_name, client_surname, reason)

    dt = datetime.strptime(f"{date} {hour}", "%Y-%m-%d %H:%M")
    Citas.objects.create(
        name=reason,
        date=dt,
        client_name=client_name,
        client_surname=client_surname,
        phone_number=phone,
        google_event_id=result.get("id", ""),
    )

    link = result.get("link", "")
    return f"Cita registrada correctamente. {('Enlace: ' + link) if link else ''}"


def chat_with_rag(query: str, memory: ChatMessageHistory) -> str:
    """Run a RAG query with calendar tools and return the AI response."""
    retriever = get_retriever()
    context = ""
    if retriever:
        results = retriever.invoke(query)
        context = "\n\n".join([d.page_content for d in results])

    from datetime import date
    today = date.today().strftime("%d/%m/%Y")
    system_message = f"{AGENT_PROMPTS}\n\nFECHA ACTUAL: {today}\n\nCONTENT:\n{context}"

    llm = ChatOpenAI(model="gpt-4o-mini")
    tools = [check_available_slots, book_appointment]

    agent = create_react_agent(llm, tools, prompt=system_message)

    messages = list(memory.messages) + [("human", query)]
    result = agent.invoke({"messages": messages})

    response = result["messages"][-1].content
    memory.add_user_message(query)
    memory.add_ai_message(response)
    return response
