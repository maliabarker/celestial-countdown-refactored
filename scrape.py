from selenium import webdriver
from selenium.webdriver.chrome.service import Service
import pandas as pd
from bs4 import BeautifulSoup

#urls = ['http://www.seasky.org/astronomy/astronomy-calendar-2022.html', 'http://www.seasky.org/astronomy/astronomy-calendar-2023.html', 'http://www.seasky.org/astronomy/astronomy-calendar-2024.html', 'http://www.seasky.org/astronomy/astronomy-calendar-2025.html', 'http://www.seasky.org/astronomy/astronomy-calendar-2026.html']

def scrape_data(url):
    s = Service('/Users/maliabarker/Desktop/main/MakeSchool/Term4/ACS_2511/chromedriver')
    driver = webdriver.Chrome(service=s)

    new_moons = []
    full_moons = []
    lunar_eclipses = []
    solar_eclipses = []
    planetary_events = []
    equinox_solstice = []
    meteor_showers = []

    driver.get(url)

    content = driver.page_source
    soup = BeautifulSoup(content, features="html.parser")

    for b1 in soup.findAll(attrs={'class': 'b1'}):
        # for new moons
        name = b1.find('p')
        if name not in new_moons:
            new_moons.append(name.text)

    for b2 in soup.findAll(attrs={'class': 'b2'}):
        # for full moons
        name1 = b2.find('p')
        if name1 not in full_moons:
            full_moons.append(name1.text)

    for b3 in soup.findAll(attrs={'class': 'b3'}):
        # for lunar eclipses
        name2 = b3.find('p')
        if name2 not in lunar_eclipses:
            lunar_eclipses.append(name2.text)

    for b4 in soup.findAll(attrs={'class': 'b4'}):
        # for solar eclipses
        name3 = b4.find('p')
        if name3 not in solar_eclipses:
            solar_eclipses.append(name3.text)

    for b5 in soup.findAll(attrs={'class': 'b5'}):
        # for planetary events
        name4 = b5.find('p')
        if name4 not in planetary_events:
            planetary_events.append(name4.text)

    for b8 in soup.findAll(attrs={'class': 'b8'}):
        # for equinoxes and solstices
        name5 = b8.find('p')
        if name5 not in equinox_solstice:
            equinox_solstice.append(name5.text)

    for b9 in soup.findAll(attrs={'class': 'b9'}):
        # for meteor showers
        name6 = b9.find('p')
        if name6 not in meteor_showers:
            meteor_showers.append(name6.text)

    series0 = pd.Series(new_moons, name = 'NewMoons')
    series1 = pd.Series(full_moons, name = 'FullMoons')
    series2 = pd.Series(lunar_eclipses, name = 'LunarEclipses')
    series3 = pd.Series(solar_eclipses, name = 'SolarEclipses')
    series4 = pd.Series(planetary_events, name = 'PlanetaryEvents')
    series5 = pd.Series(equinox_solstice, name = 'EquinoxesSolstices')
    series6 = pd.Series(meteor_showers, name = 'MeteorShowers')

    df = pd.DataFrame({'NewMoons': series0, 'FullMoons': series1, 'LunarEclipses': series2, 'SolarEclipses': series3, 'PlanetaryEvents': series4, 'EquinoxesSolstices': series5, 'MeteorShowers': series6})
    df.to_csv('celestial_events.csv', index=False, encoding='utf-8')