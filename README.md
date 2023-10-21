
# SUPREMA PHOTO TEST





## Run Locally

Clone the project

```bash
  git clone https://github.com/martinezEdu/suprema-gsdk-face-test.git
```

Go to the project directory

```bash
  cd suprema-gsdk-face-test
```

Install dependencies

```bash
  yarn install
```

Connect all biometrics

```bash
  node connect.js
```

Send a user

```bash
  node setUser.js
```

Delete a user

```bash
  node deleteUser.js
```

Send a photo

```bash
  node setPhoto.js
```

Delete a photo

```bash
  node deletePhoto.js
```


## Support

For support, email em@intelli-next or join our Slack channel.


## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`GATEWAY_IP`

`GATEWAY_PORT`

`QUEUE_SIZE`

`MAX_NUM_OF_LOG`

`DEVICE_ID`

