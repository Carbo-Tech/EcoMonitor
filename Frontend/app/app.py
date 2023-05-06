from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

def connectDB():
    try:
        connection = mysql.connector.connect(host='eco_monitor_mysql',
                                             user='root',
                                             database='edciv',
                                             password='passwordsicura')
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_Info)
            return connection
    except Error as e:
        print("Error while connecting to MySQL", e)

def fetchAllDict(cursor):
    columns = [column[0] for column in cursor.description]
    ret = []
    all = cursor.fetchall()
    if not all:
        return None
    for row in all:
        ret.append(dict(zip(columns, row)))
    return ret


def fetchOneDict(cursor):
    one = cursor.fetchone()
    if not one:
        return None
    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, one))

@app.route('/')
def home():
    dati = []

    connection = connectDB()
    cursor = connection.cursor()
    sql = "SELECT * FROM rilevazioni JOIN stazioni ON stazioni.codseqst=rilevazioni.codseqst ORDER by data;"
    cursor.execute(sql)
    dati = fetchAllDict(cursor)

    # close connection
    cursor.close()
    connection.close()
    print("MySQL connection is closed")

    return render_template('index.html', dati=dati)

@app.route('/graph')
def graph():
    data=[]
    for i in range(10):
        data.append(random.randint(1, 100))
    return render_template('graph.html',data=data)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')


# curl "https://439b-37-160-149-95.ngrok-free.app/api/v1/graph-data?station=Conegliano&pollutant=pm10"
@app.route('/api/v1/graph-data')
def dataApi():
    data = []
    connection = connectDB()
    station = request.args.get('station')
    pollutant = request.args.get('pollutant')
    if station and pollutant:
        try:
            cursor = connection.cursor()
            # todo: protect against SQLi
            sql = "SELECT * FROM rilevazioni JOIN stazioni ON stazioni.codseqst=rilevazioni.codseqst WHERE stazioni.nome=%s AND rilevazioni.tipoInquinante=%s ORDER by data;"
            params = (station,pollutant)
            cursor.execute(sql, params)
            data = fetchAllDict(cursor)
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
            return jsonify(data)
        except KeyError:
            return jsonify({"error": "Invalid station or pollutant"})
    else:
        return jsonify({"error": "Missing station or pollutant parameter"})


if __name__ == '__main__':
    app.run(debug=True)
