!function() {

    var today = moment();
  
    function Calendar(selector, events) {
      this.el = document.querySelector(selector);
      this.events = events;
      this.current = moment().date(1);
      this.events.forEach(function(ev) {
       ev.date = moment(ev.date);
      });
      this.draw();
      var current = document.querySelector('.today');
      if(current) {
        var self = this;
        window.setTimeout(function() {
          self.openDay(current);
        }, 500);
      }
      
    }
  
    Calendar.prototype.draw = function() {
      //Create Header
      this.drawHeader();
  
      //Draw Month
      this.drawMonth();
  
      this.drawLegend();
    }
  
    Calendar.prototype.drawHeader = function() {
      var self = this;
      if(!this.header) {
        //Create the header elements
        this.header = createElement('div', 'header');
        this.header.className = 'header';
  
        this.title = createElement('h1');
  
        var right = createElement('div', 'right');
        right.addEventListener('click', function() { self.nextMonth(); });
  
        var left = createElement('div', 'left');
        left.addEventListener('click', function() { self.prevMonth(); });
  
        //Append the Elements
        this.header.appendChild(this.title); 
        this.header.appendChild(right);
        this.header.appendChild(left);
        this.el.appendChild(this.header);
      }
  
      this.title.innerHTML = this.current.format('MMMM YYYY');
    }
  
    Calendar.prototype.drawMonth = function() {
      var self = this;
      
      
      if(this.month) {
        this.oldMonth = this.month;
        this.oldMonth.className = 'month out ' + (self.next ? 'next' : 'prev');
        this.oldMonth.addEventListener('webkitAnimationEnd', function() {
          self.oldMonth.parentNode.removeChild(self.oldMonth);
          self.month = createElement('div', 'month');
          self.backFill();
          self.currentMonth();
          self.fowardFill();
          self.el.appendChild(self.month);
          window.setTimeout(function() {
            self.month.className = 'month in ' + (self.next ? 'next' : 'prev');
          }, 16);
        });
      } else {
          this.month = createElement('div', 'month');
          this.el.appendChild(this.month);
          this.backFill();
          this.currentMonth();
          this.fowardFill();
          this.month.className = 'month new';
      }
    }
  
    Calendar.prototype.backFill = function() {
      var clone = this.current.clone();
      var dayOfWeek = clone.day();
  
      if(!dayOfWeek) { return; }
  
      clone.subtract('days', dayOfWeek+1);
  
      for(var i = dayOfWeek; i > 0 ; i--) {
        this.drawDay(clone.add('days', 1));
      }
    }
  
    Calendar.prototype.fowardFill = function() {
      var clone = this.current.clone().add('months', 1).subtract('days', 1);
      var dayOfWeek = clone.day();
  
      if(dayOfWeek === 6) { return; }
  
      for(var i = dayOfWeek; i < 6 ; i++) {
        this.drawDay(clone.add('days', 1));
      }
    }
  
    Calendar.prototype.currentMonth = function() {
      var clone = this.current.clone();
  
      while(clone.month() === this.current.month()) {
        this.drawDay(clone);
        clone.add('days', 1);
      }
    }
  
    Calendar.prototype.getWeek = function(day) {
      if(!this.week || day.day() === 0) {
        this.week = createElement('div', 'week');
        this.month.appendChild(this.week);
      }
    }
  
    Calendar.prototype.drawDay = function(day) {
      var self = this;
      this.getWeek(day);
  
      //Outer Day
      var outer = createElement('div', this.getDayClass(day));
      outer.addEventListener('click', function() {
        self.openDay(this);
      });
  
      //Day Name
      var name = createElement('div', 'day-name', day.format('ddd'));
  
      //Day Number
      var number = createElement('div', 'day-number', day.format('DD'));
  
  
      //Events
      var events = createElement('div', 'day-events');
      this.drawEvents(day, events);
  
      outer.appendChild(name);
      outer.appendChild(number);
      outer.appendChild(events);
      this.week.appendChild(outer);
    }
  
    Calendar.prototype.drawEvents = function(day, element) {
      if(day.month() === this.current.month()) {
        var todaysEvents = this.events.reduce(function(memo, ev) {
          if(ev.date.isSame(day, 'day')) {
            memo.push(ev);
          }
          return memo;
        }, []);
  
        todaysEvents.forEach(function(ev) {
          var evSpan = createElement('span', ev.color);
          element.appendChild(evSpan);
        });
      }
    }
  
    Calendar.prototype.getDayClass = function(day) {
      classes = ['day'];
      if(day.month() !== this.current.month()) {
        classes.push('other');
      } else if (today.isSame(day, 'day')) {
        classes.push('today');
      }
      return classes.join(' ');
    }
  
    Calendar.prototype.openDay = function(el) {
      var details, arrow;
      var dayNumber = +el.querySelectorAll('.day-number')[0].innerText || +el.querySelectorAll('.day-number')[0].textContent;
      var day = this.current.clone().date(dayNumber);
  
      var currentOpened = document.querySelector('.details');
  
      //Check to see if there is an open detais box on the current row
      if(currentOpened && currentOpened.parentNode === el.parentNode) {
        details = currentOpened;
        arrow = document.querySelector('.arrow');
      } else {
        //Close the open events on differnt week row
        //currentOpened && currentOpened.parentNode.removeChild(currentOpened);
        if(currentOpened) {
          currentOpened.addEventListener('webkitAnimationEnd', function() {
            currentOpened.parentNode.removeChild(currentOpened);
          });
          currentOpened.addEventListener('oanimationend', function() {
            currentOpened.parentNode.removeChild(currentOpened);
          });
          currentOpened.addEventListener('msAnimationEnd', function() {
            currentOpened.parentNode.removeChild(currentOpened);
          });
          currentOpened.addEventListener('animationend', function() {
            currentOpened.parentNode.removeChild(currentOpened);
          });
          currentOpened.className = 'details out';
        }
  
        //Create the Details Container
        details = createElement('div', 'details in');
  
        //Create the arrow
        var arrow = createElement('div', 'arrow');
  
        //Create the event wrapper
  
        details.appendChild(arrow);
        el.parentNode.appendChild(details);
      }
  
      var todaysEvents = this.events.reduce(function(memo, ev) {
        if(ev.date.isSame(day, 'day')) {
          memo.push(ev);
        }
        return memo;
      }, []);
  
      this.renderEvents(todaysEvents, details);
  
      arrow.style.left = el.offsetLeft - el.parentNode.offsetLeft + 27 + 'px';
    }
  
    Calendar.prototype.renderEvents = function(events, ele) {
      //Remove any events in the current details element
      var currentWrapper = ele.querySelector('.events');
      var wrapper = createElement('div', 'events in' + (currentWrapper ? ' new' : ''));
  
      events.forEach(function(ev) {
        var div = createElement('div', 'event');
        var square = createElement('div', 'event-category ' + ev.color);
        var span = createElement('span', '', ev.eventName);
  
        div.appendChild(square);
        div.appendChild(span);
        wrapper.appendChild(div);
      });
  
      if(!events.length) {
        var div = createElement('div', 'event empty');
        var span = createElement('span', '', 'No Events');
  
        div.appendChild(span);
        wrapper.appendChild(div);
      }
  
      if(currentWrapper) {
        currentWrapper.className = 'events out';
        currentWrapper.addEventListener('webkitAnimationEnd', function() {
          currentWrapper.parentNode.removeChild(currentWrapper);
          ele.appendChild(wrapper);
        });
        currentWrapper.addEventListener('oanimationend', function() {
          currentWrapper.parentNode.removeChild(currentWrapper);
          ele.appendChild(wrapper);
        });
        currentWrapper.addEventListener('msAnimationEnd', function() {
          currentWrapper.parentNode.removeChild(currentWrapper);
          ele.appendChild(wrapper);
        });
        currentWrapper.addEventListener('animationend', function() {
          currentWrapper.parentNode.removeChild(currentWrapper);
          ele.appendChild(wrapper);
        });
      } else {
        ele.appendChild(wrapper);
      }
    }
  
    Calendar.prototype.drawLegend = function() {
      var legend = createElement('div', 'legend');
      var calendars = this.events.map(function(e) {
        return e.calendar + '|' + e.color;
      }).reduce(function(memo, e) {
        if(memo.indexOf(e) === -1) {
          memo.push(e);
        }
        return memo;
      }, []).forEach(function(e) {
        var parts = e.split('|');
        var entry = createElement('span', 'entry ' +  parts[1], parts[0]);
        legend.appendChild(entry);
      });
      let row = document.getElementById('row')
      legend.classList.add('col-sm-8')
      legend.classList.add('text-center')
      legend.classList.add('mb-4')
      
      legend.style.fontWeight='100';
      row.appendChild(legend)


      // this.el.appendChild(legend);
    }
  
    Calendar.prototype.nextMonth = function() {
      this.current.add('months', 1);
      this.next = true;
      this.draw();
    }
  
    Calendar.prototype.prevMonth = function() {
      this.current.subtract('months', 1);
      this.next = false;
      this.draw();
    }
  
    window.Calendar = Calendar;
  
    function createElement(tagName, className, innerText) {
      var ele = document.createElement(tagName);
      if(className) {
        ele.className = className;
      }
      if(innerText) {
        ele.innderText = ele.textContent = innerText;
      }
      return ele;
    }
  }();
  
  !function() {
    var a = document.createElement('a');
    var data = [
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-01-24' },
      { eventName: 'Mercury at Greatest Western Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-03-06' },
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-05-17' },
      { eventName: 'Mercury at Greatest Western Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-07-04' },
      { eventName: 'Saturn at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2021-08-02' },
      { eventName: 'Jupiter at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2021-08-19' },
      { eventName: 'Neptune at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2021-09-14' },
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-09-14' },
      { eventName: 'Mercury at Greatest Western Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-10-25' },
      { eventName: 'Venus at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2021-10-29' },
      { eventName: 'Uranus at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2021-11-05' },
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-01-07' },
      
      { eventName: 'Mercury at Greatest Western Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-02-16' },
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-04-29' },
      { eventName: 'Mercury at Greatest Western Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-06-16' },
      { eventName: 'Saturn at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2022-08-14' },
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-08-27' },
      { eventName: 'Neptune at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2022-09-16' },
      { eventName: 'Jupiter at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2022-09-26' },
      { eventName: 'Mercury at Greatest Western Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-10-08' },
      { eventName: 'Uranus at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2022-11-09' },
      { eventName: 'Mars at Opposition', calendar: 'Planetary Event', color: 'orange', date: '2022-12-08' },
      { eventName: 'Mercury at Greatest Eastern Elongation', calendar: 'Planetary Event', color: 'orange', date: '2022-12-21' },



  
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-01-13' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-01-28' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-02-11' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-02-27' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-03-13' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-03-28' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-04-12' },
      { eventName: 'Full Moon, Supermoon', calendar: 'Moon Event', color: 'blue', date: '2021-04-27' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-05-11' },
      { eventName: 'Full Moon, Supermoon', calendar: 'Moon Event', color: 'blue', date: '2021-05-26' },
      { eventName: 'Total Lunar Eclipse', calendar: 'Moon Event', color: 'blue', date: '2021-05-26' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-06-10' },
      { eventName: 'Full Moon, Supermoon', calendar: 'Moon Event', color: 'blue', date: '2021-06-24' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-07-10' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-07-24' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-08-08' },
      { eventName: 'Full Moon, Blue Moon', calendar: 'Moon Event', color: 'blue', date: '2021-08-22' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-09-07' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-09-20' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-10-06' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-10-20' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-11-04' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-11-19' },
      { eventName: 'Partial Lunar Eclipse', calendar: 'Moon Event', color: 'blue', date: '2021-11-19' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2021-12-04' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2021-12-19' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-01-02' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-01-17' },
      
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-02-01' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-02-16' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-03-02' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-03-18' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-04-01' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-04-16' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-04-30' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-05-16' },
      { eventName: 'Total Lunar Eclipse', calendar: 'Moon Event', color: 'blue', date: '2022-05-16' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-05-30' },
      { eventName: 'Full Moon, Supermoon', calendar: 'Moon Event', color: 'blue', date: '2022-06-14' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-06-29' },
      { eventName: 'Full Moon, Supermoon', calendar: 'Moon Event', color: 'blue', date: '2022-07-13' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-07-28' },
      { eventName: 'Full Moon, Supermoon', calendar: 'Moon Event', color: 'blue', date: '2022-08-12' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-08-27' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-09-10' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-09-25' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-10-09' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-10-25' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-11-08' },
      { eventName: 'Total Lunar Eclipse', calendar: 'Moon Event', color: 'blue', date: '2022-11-08' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-11-23' },
      { eventName: 'Full Moon', calendar: 'Moon Event', color: 'blue', date: '2022-12-08' },
      { eventName: 'New Moon', calendar: 'Moon Event', color: 'blue', date: '2022-12-23' },
  


      { eventName: 'March Equinox', calendar: 'Solar Event', color: 'yellow', date: '2021-03-20' },
      { eventName: 'Annual Solar Eclipse', calendar: 'Solar Event', color: 'yellow', date: '2021-06-10' },
      { eventName: 'June Solstice', calendar: 'Solar Event', color: 'yellow', date: '2021-06-21' },
      { eventName: 'September Equinox', calendar: 'Solar Event', color: 'yellow', date: '2021-09-22' },
      { eventName: 'Total Solar Eclipse', calendar: 'Solar Event', color: 'yellow', date: '2021-12-04' },
      { eventName: 'December Solstice', calendar: 'Solar Event', color: 'yellow', date: '2021-12-21' },
      
      { eventName: 'March Equinox', calendar: 'Solar Event', color: 'yellow', date: '2022-03-20' },
      { eventName: 'Partial Solar Eclipse', calendar: 'Solar Event', color: 'yellow', date: '2022-04-30' },
      { eventName: 'June Solstice', calendar: 'Solar Event', color: 'yellow', date: '2022-06-21' },
      { eventName: 'September Equinox', calendar: 'Solar Event', color: 'yellow', date: '2022-09-23' },
      { eventName: 'Partial Solar Eclipse', calendar: 'Solar Event', color: 'yellow', date: '2022-10-25' },
      { eventName: 'December Solstice', calendar: 'Solar Event', color: 'yellow', date: '2022-12-21' },
  


      { eventName: 'Quadrantids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-01-02' },
      { eventName: 'Quadrantids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-01-03' },
      { eventName: 'Lyrids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-04-22' },
      { eventName: 'Lyrids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-04-23' },
      { eventName: 'Eta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-05-06' },
      { eventName: 'Eta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-05-07' },
      { eventName: 'Delta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-07-28' },
      { eventName: 'Delta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-07-29' },
      { eventName: 'Perseids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-08-12' },
      { eventName: 'Perseids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-08-13' },
      { eventName: 'Draconids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-10-07' },
      { eventName: 'Orionids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-10-21' },
      { eventName: 'Orionids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-10-22' },
      { eventName: 'Taurids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-11-04' },
      { eventName: 'Taurids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-11-05' },
      { eventName: 'Leonids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-11-17' },
      { eventName: 'Leonids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-11-18' },
      { eventName: 'Geminids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-12-13' },
      { eventName: 'Geminids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-12-14' },
      { eventName: 'Ursids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-12-21' },
      { eventName: 'Ursids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2021-12-22' },
      { eventName: 'Quadrantids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-01-03' },
      { eventName: 'Quadrantids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-01-04' },
      
      { eventName: 'Lyrids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-04-22' },
      { eventName: 'Lyrids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-04-23' },
      { eventName: 'Eta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-05-06' },
      { eventName: 'Eta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-05-07' },
      { eventName: 'Delta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-07-28' },
      { eventName: 'Delta Aquarids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-07-29' },
      { eventName: 'Perseids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-08-12' },
      { eventName: 'Perseids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-08-13' },
      { eventName: 'Draconids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-10-07' },
      { eventName: 'Orionids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-10-21' },
      { eventName: 'Orionids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-10-22' },
      { eventName: 'Taurids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-11-04' },
      { eventName: 'Taurids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-11-05' },
      { eventName: 'Leonids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-11-17' },
      { eventName: 'Leonids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-11-18' },
      { eventName: 'Geminids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-12-13' },
      { eventName: 'Geminids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-12-14' },
      { eventName: 'Ursids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-12-21' },
      { eventName: 'Ursids Meteor Shower', calendar: 'Meteors, Comets, & Asteroids', color: 'green', date: '2022-12-22' },
    ];
  
    var calendar = new Calendar('#calendar', data);
  
  }();
  