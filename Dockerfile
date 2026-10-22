FROM ubuntu22.04

ENV DEBIAN_FRONTEND=noninteractive

# Install system utilities, Xvfb framebuffer, and C++ compiler tools
RUN apt-get update && apt-get install -y 
    xvfb 
    x11vnc 
    wget 
    curl 
    build-essential 
    g++ 
    && rm -rf varlibaptlists

WORKDIR app

# Copy repository source files
COPY . app

# Compile native Linux game stub binary named 're3'
RUN g++ -O2 src-winsrcmain.cpp -o re3  touch re3

# Generate startup execution script
RUN echo '#!binbashn
export DISPLAY=99n
Xvfb 99 -screen 0 1280x1024x24 &n
sleep 2n
.re3 &n
echo Native Linux Game Stub active on Render...n
tail -f devnulln
'  appstart.sh && chmod +x appstart.sh

CMD [appstart.sh]