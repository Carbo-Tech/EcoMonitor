# -*- coding: utf-8 -*-
from flask import Flask, render_template, request, jsonify
import mysql.connector
from mysql.connector import Error
import os
import sys

app = Flask(__name__)


def connect_db():
    try:
        connection = mysql.connector.connect(
            host=os.environ.get('DB_HOST'),
            user=os.environ.get('DB_USER'),
            database=os.environ.get('DB_NAME'),
            password=os.environ.get('DB_PASSWORD'),
            charset="utf8"
        )
        if connection.is_connected():
            db_info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_info)
            return connection
    except Error as e:
        print("Error while connecting to MySQL", e)


def fetch_all_dict(cursor):
    columns = [column[0] for column in cursor.description]
    ret = []
    all_rows = cursor.fetchall()
    if not all_rows:
        return None
    for row in all_rows:
        # Decode string values from UTF-8 to Unicode
        row = [value.decode('utf-8') if isinstance(value,
                                                   bytes) else value for value in row]
        ret.append(dict(zip(columns, row)))
    return ret


def fetch_one_dict(cursor):
    one_row = cursor.fetchone()
    if not one_row:
        return None
    columns = [column[0] for column in cursor.description]
    return dict(zip(columns, one_row))


@app.route('/', methods=['GET'])
def home():

    return render_template('index.html')


@app.route('/graph', methods=['GET'])
def graph():
    return render_template('graph.html')


@app.route('/about', methods=['GET'])
def about():
    return render_template('about.html')


@app.route('/contact', methods=['GET'])
def contact():
    return render_template('contact.html')

@app.route('/stationsmap', methods=['GET'])
def stationsmap():
    return render_template('map.html')

@app.route('/api/v1/stations', methods=['GET'])
def get_stations():
    connection = connect_db()
    try:
        cursor = connection.cursor()
        sql = "SELECT DISTINCT nome,lon,lat FROM stazioni ORDER BY nome;"
        cursor.execute(sql)
        data = fetch_all_dict(cursor=cursor)
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
        if not data:
            return jsonify({"error": "No stations found"}), 404
        return jsonify(data),200
    except:
        return jsonify({"error": "Unable to fetch stations"}),500


@app.route('/api/v1/stations/<string:station>/pollutants', methods=['GET'])
def get_pollutants(station):
    data = []
    connection = connect_db()
    try:
        cursor = connection.cursor()
        sql = "SELECT DISTINCT tipoInquinante FROM rilevazioni WHERE codseqst = (SELECT codseqst FROM stazioni WHERE nome=%s);"
        cursor.execute(sql, (station,))
        data = [x[0] for x in cursor.fetchall()]
        cursor.close()
        connection.close()
        print("MySQL connection is closed")
        if not data:
            return jsonify({"error": "No pollutants found for the given station"}), 404
        return jsonify(data),200
    except:
        return jsonify({"error": "Unable to fetch pollutants for this station"}),500


@app.route('/api/v1/stations/<string:station>/pollutants/<string:pollutant>', methods=['GET'])
def get_data(station, pollutant):
    try:
        connection = connect_db()

        with connection.cursor() as cursor:
            sql = """SELECT * FROM rilevazioni 
                        JOIN stazioni ON stazioni.codseqst=rilevazioni.codseqst 
                        WHERE (%(station)s = 'any' OR stazioni.nome = %(station)s) 
                        AND (%(pollutant)s = 'any' OR rilevazioni.tipoInquinante = %(pollutant)s) 
                        ORDER BY %(orderby)s 
                        LIMIT %(limit)s OFFSET %(offset)s;"""
            params = {
                "station": station,
                "pollutant": pollutant,
                "offset": request.args.get('offset', default=0, type=int),
                "orderby": request.args.get('orderby', default="data", type=str),
                "limit": request.args.get('limit', default=sys.maxsize, type=int),
            }
            cursor.execute(sql, params)
            data = fetch_all_dict(cursor)
            print(data)

        connection.close()

        if not data:
            return jsonify({"error": "No data found for the given station and pollutant"}), 404
            
        return jsonify(data),200

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500




if __name__ == '__main__':
    app.run(debug=True)
