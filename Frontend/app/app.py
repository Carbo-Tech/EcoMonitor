from flask import Flask, render_template
import mysql.connector
from mysql.connector import Error

app = Flask(__name__)

@app.route('/')
def home():
    dati = []
    try:
        connection = mysql.connector.connect(host='eco_monitor_mysql',
                                             user='root',
                                             database='edciv',
                                             password='passwordsicura')
        if connection.is_connected():
            db_Info = connection.get_server_info()
            print("Connected to MySQL Server version ", db_Info)
            cursor = connection.cursor()
            cursor.execute("select database()", "")
            record = cursor.fetchone()
            print("You're connected to database: ", record)
            print("Performing queries...")
            # query
            sql = "SELECT * FROM rilevazioni;"
            cursor.execute(sql)
            dati = cursor.fetchall()

            # close connection
            cursor.close()
            connection.close()
            print("MySQL connection is closed")
    except Error as e:
        print("Error while connecting to MySQL", e)

    return render_template('index.html', dati=dati)

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

if __name__ == '__main__':
    app.run()