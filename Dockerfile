# syntax=docker/dockerfile:1

# Base python image
FROM python:3.8-slim-buster

COPY ./requirements.txt /app/requirements.txt

# switch the working directory to app
WORKDIR /app

# Install App dependencies
RUN pip3 install -r requirements.txt

# Copy the code into a folder named app
COPY . /app

#CMD ["python", "-u", "app.py"]
ENTRYPOINT [ "python" ]

CMD [ "app.py" ]