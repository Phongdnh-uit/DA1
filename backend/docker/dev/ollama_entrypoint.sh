#!/bin/bash
set -e

/bin/ollama serve &
sleep 5

ollama pull phi3:3.8b-mini-128k-instruct-q2_K
ollama pull nomic-embed-text

wait
