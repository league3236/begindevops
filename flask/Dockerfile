FROM python:3.7
WORKDIR /usr/src/app
COPY ["requirements.txt", "app.py", "config.py", "./"]
RUN pip install --no-cache-dir -r requirements.txt
CMD [ "python", "./app.py" ]