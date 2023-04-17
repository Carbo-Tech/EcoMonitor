from flask import Flask, render_template

app = Flask(__name__)

@app.route('/')
def home():
    dati = [{'data': '01/01/2021', 'pm10': 20, 'pm25': 10},
    {'data': '02/01/2021', 'pm10': 18, 'pm25': 7},
    {'data': '03/01/2021', 'pm10': 24, 'pm25': 11},
    {'data': '04/01/2021', 'pm10': 14, 'pm25': 8},
    {'data': '05/01/2021', 'pm10': 12, 'pm25': 6}]
    return render_template('index.html', dati=dati)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run()