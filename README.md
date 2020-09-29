# IIS

Domain: [http://iis-projekt.ddns.net/](http://iis-projekt.ddns.net/)

Analýza požadavků: https://www.overleaf.com/8514163942ptgczrbssszt

### MySQL server:
<details>
  <summary>IP and credentials</summary>
  
    IP: 93.153.43.141\
    username: rootRemote\
    password: rootRemote
  
</details>



### API:
pip requirements:
- python-dotenv

initialize server:
```bash
cd ./ISS/backend/
flask run
```
Check if [http://localhost:5000/time](http://localhost:5000/time) is available


### React app
```bash
cd ./ISS/frontend/
npm install react
npm start
```
Check if [http://localhost:3000/](http://localhost:3000/) is available
