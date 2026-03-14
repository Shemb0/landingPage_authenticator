import os
import tempfile
from django.conf import settings
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_core.prompts import PromptTemplate
from dotenv import load_dotenv
from langchain_community.chat_message_histories import  ChatMessageHistory
from .prompts import AGENT_PROMPTS

_retriever = None

def get_retriever():
    global _retriever
    chroma_dir = settings.CHROMA_DIR
    if os.path.exists(chroma_dir) and os.listdir(chroma_dir):
        embedding = OpenAIEmbeddings()
        db = Chroma(persist_directory=chroma_dir,embedding_function=embedding)
        _retriever = db.as_retriever(search_kwargs={"k": 3})
    return _retriever

def index_pdf_from_bytes(pdf_bytes: bytes,):
    """Index a PDF from bytes into Chroma vector store."""
    with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as tmp:
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

def chat_with_rag(query: str, memory: ChatMessageHistory) -> str:
    """Run a RAG query and return the AI response."""
    retriever = get_retriever()

    context = ""
    if retriever:
        results = retriever.invoke(query)
        context = "\n\n".join([d.page_content for d in results])

     # Obtiene el historial de la conversación
    history = "\n".join([
      f"{'Usuario' if m.type == 'human' else 'Asistente'}: {m.content}"
      for m in memory.messages
  ])

    llm = ChatOpenAI(model="gpt-4o-mini")
    prompt_template = PromptTemplate(
        template=AGENT_PROMPTS,
        input_variables=["context", "query","history"],
    )
    chain = prompt_template | llm
    result = chain.invoke({"context": context, "query": query, "history": history})

     # Guarda la pregunta y respuesta en memoria
    memory.add_user_message(query)
    memory.add_ai_message(result.content)
    return result.content