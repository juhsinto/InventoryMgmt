FROM python:3.10.6-slim-buster

WORKDIR /app

COPY requirements.txt requirements.txt

RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 8000

COPY bash_cmds.sh /app/bash_cmds.sh
RUN chmod +x /app/bash_cmds.sh

CMD ["/app/bash_cmds.sh"]