# What i do 

## Fetch Source Code

```
git clone https://<username>@bitbucket.org/donnydey/donnies-list.git
```

## Database Installation Locally (optional)

If you want to delete the your existng db

```bash
mongo donnyslist --eval "db.dropDatabase()"
```

To populate the DB

```bash
mongorestore -d donnyslist db/
```

## Packages installation

```
./install.sh
```

```
cd client
npm install
```

```
cd server
npm install
```

### change directory to client

```
cd client

```

### build image

```
docker build -t whatido .

```

### Run container

```
docker run -p 3000:3000 whatido

```

### Run container with docker compose

```
docker-compose -f docker-compose.dev.yml up
```

### Run manually

cd server
npm install

```


## Usage run the server before the client

```

cd server
npm run dev

```

```

cd server
npm run start

```

Hit this url on browser : http://0.0.0.0:3000/
```
