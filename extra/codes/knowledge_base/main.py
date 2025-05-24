from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env

import os
import shutil
# Updated imports for TextLoader and Chroma
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.docstore.document import Document
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import Chroma

# Directories for documents and database
docs_directory = "docs"
db_directory = "db"

########################################################################################################
#################################### Functions #########################################################
########################################################################################################

def load_documents(directory_path):
    """
    Load all text documents from the specified directory.

    Args:
        directory_path (str): Path to the directory containing documents.

    Returns:
        List[Document]: A list of loaded Document objects.
    """
    documents = []
    for root, dirs, files in os.walk(directory_path):
        for file in files:
            file_path = os.path.join(root, file)
            loader = TextLoader(file_path, encoding='utf8')
            loaded_docs = loader.load()
            documents.extend(loaded_docs)
    print(f"\n- {len(documents)} files have been loaded.")
    return documents

def split_texts(documents):
    """
    Split the content of each document into smaller chunks.

    Args:
        documents (List[Document]): A list of Document objects.

    Returns:
        List[Document]: A list of new Document objects containing the chunks.
    """
    texts = []
    # Initialize the text splitter once for all documents
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=100,
        chunk_overlap=0,
        separators=["---"],
        keep_separator=True,
        is_separator_regex=True
    )

    for document in documents:
        content = document.page_content
        metadata = document.metadata

        if content is None:
            print(f"Skipping document with None content: {metadata}")
            continue

        # Split the content into chunks
        chunks = text_splitter.split_text(content)

        # Process the resulting chunks
        for idx, chunk in enumerate(chunks):
            if chunk.strip():
                # Create a new document for each non-empty chunk
                new_document = Document(page_content=chunk, metadata=metadata)
                texts.append(new_document)
                # Display the created chunk
                # print(f"Chunk {idx+1} from document {metadata.get('source', 'unknown')}:\n{chunk}\n------------------------------\n")
            else:
                print("Discarded an empty chunk.\n------------------------------\n")

    print(f"- {len(texts)} documents have been created.")
    return texts

def create_db(docs_directory, db_directory):
    """
    Create a Chroma vector database from the documents in the specified directory.

    Args:
        docs_directory (str): Path to the directory containing documents.
        db_directory (str): Path to the directory where the database will be stored.

    Returns:
        Chroma: The created Chroma vector database.
    """
    # Verify if the documents directory exists and contains files
    if not os.path.exists(docs_directory) or not os.listdir(docs_directory):
        raise Exception(f"No documents found in {docs_directory}. Please add documents to the directory.")

    # Verify if the database directory exists; if so, empty it
    if not os.path.exists(db_directory):
        print(f"No existing Chroma database found in {db_directory}. Creating folder.")
        os.makedirs(db_directory)
    else:
        # Empty the database directory
        for file in os.listdir(db_directory):
            file_path = os.path.join(db_directory, file)
            try:
                if os.path.isfile(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
                print(f"Removed {file_path}")
            except Exception as e:
                print(e)

    # Load documents
    documents = load_documents(docs_directory)
    # Split documents into chunks
    texts = split_texts(documents)
    # Initialize the embedding model
    embedding_model = OpenAIEmbeddings(model="text-embedding-ada-002")
    # Create the Chroma vector database
    db = Chroma.from_documents(texts, embedding_model, persist_directory=db_directory)
    # Persistence is automatic in Chroma 0.4.x and above
    print("Chroma database created.\n")
    return db

########################################################################################################
#################################### Program ###########################################################
########################################################################################################

if __name__ == "__main__":
    print("Loading documents...")
    # Create the vector database from documents
    vector_db = create_db(docs_directory, db_directory)
    print("Documents loaded.\n")
