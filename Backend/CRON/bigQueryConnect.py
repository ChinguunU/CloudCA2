"""Simple application that performs a query with BigQuery."""
# To run the application first run the venv script 
# venv\Scripts\activate.bat
# then in cmd run the command python bigQueryConnect.py
# [START bigquery_simple_app_all]
# [START bigquery_simple_app_deps]
from google.cloud import bigquery
from google.oauth2 import service_account
import requests 
import datetime
# [END bigquery_simple_app_deps]
credentials = service_account.Credentials.from_service_account_file(
    filename="CovidApp-27181bd94c4c.json"
)

date = datetime.datetime.now()
# get the start date for our data analysis for one month ago
start_date = datetime.datetime.now() - datetime.timedelta(30)
print(start_date)
START_day = start_date.strftime("%d")
START_month = start_date.strftime("%m")
START_year = start_date.strftime("%Y")
# GQL likes the date formatted as 
QUERY_start_date = "{}-{}-{}".format(START_year, START_month, START_day)
print("Start date " + QUERY_start_date)

# Date for the dynamoDB entry dd-mm-yy   %y gives yy %Y gives YYYY
ENTRY_date = "{}-{}-{}".format(date.strftime("%d"),date.strftime("%m"),date.strftime("%y"))
print("Date stamp for Dynamo = {}".format(ENTRY_date))

def query_covid_ecdc():
    # [START bigquery_simple_app_client]
    client = bigquery.Client(
        credentials=credentials,
        project=credentials.project_id
    )
    # [END bigquery_simple_app_client]
    # [START bigquery_simple_app_query]
    query_job = client.query("""
        SELECT *
        FROM `bigquery-public-data.covid19_ecdc.covid_19_geographic_distribution_worldwide`
        LIMIT 10""")

    results = query_job.result()
    # for row in results:
    #     print("{} : {} {} {} ".format(row.countries_and_territories, row.daily_confirmed_cases, row.daily_deaths, row.date))

    # get the list of countries from the database
    # changed this from countries_and_territories to geo_id SELECT DISTINCT countries_and_territories
    query_countries = client.query("""
        SELECT DISTINCT geo_id
        FROM 
        `bigquery-public-data.covid19_ecdc.covid_19_geographic_distribution_worldwide`
        """)
    countries = query_countries.result()
    for row in countries:
        # run a query for the last 30 days where month is equal to 4
        # was print("{}".format(row.countries_and_territories))
        print("{}".format(row.geo_id))
        query_data_by_country = client.query("""
            SELECT *
            FROM `bigquery-public-data.covid19_ecdc.covid_19_geographic_distribution_worldwide`
            WHERE geo_id = '{}' and DATE < cast('{}' as date)
            ORDER BY date
        """.format(row.geo_id, QUERY_start_date))
        
        total_cases = 0
        total_deaths = 0
        data_by_country = query_data_by_country.result()
        for row in data_by_country:
            # print("{}".format(row.daily_confirmed_cases))
            total_cases += row.daily_confirmed_cases 
            total_deaths += row.daily_deaths
        print("Total cases for the past 30 days {}".format(total_cases))
        # calculating the average new cases
        average = total_cases/30
        # calculating the average deaths 
        average_deaths = total_deaths/30 
        print("average cases per day: {}".format(average))
        print("average deaths per day: {}".format(average_deaths))
        POST_URL = "https://4prxbmd4q6.execute-api.us-east-1.amazonaws.com/development"

        POST_data = { 
            "country": row.geo_id,
            "date": ENTRY_date,
            "rateOfGrowth": average,
            "nextDayPrediction": average,
            "nextDayPredictionDeaths": average_deaths,
            "rateOfGrowthDeaths": average_deaths}
        POST_Request = requests.post(url = POST_URL,json= POST_data)
        pastbin_url = POST_Request.text
        print(POST_data)
        print(pastbin_url)
        print("End of GQL Request for {}".format(row.geo_id))

if __name__ == '__main__':
    query_covid_ecdc()
# [END bigquery_simple_app_all]