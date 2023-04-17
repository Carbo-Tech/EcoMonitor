# syntax=docker/dockerfile:1.4
FROM python:3-alpine

# Create app directory
WORKDIR /app
ENV FLASK_APP=app/app.py
# Install app dependencies
COPY requirements.txt ./

RUN pip install -r requirements.txt

# Bundle app source
COPY . .

EXPOSE 3000
CMD [ "flask", "run","--host","0.0.0.0","--port","3000", "--debug"]