#!/bin/bash
set -e

/bin/ollama serve &
sleep 5

ollama pull llama3:8b
ollama pull nomic-embed-text

wait
