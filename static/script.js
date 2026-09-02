document.addEventListener("DOMContentLoaded", function () {
  var toggle = document.getElementById('navToggle');
  var nav = document.getElementById('siteNav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
    });

    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        nav.classList.remove('open');
      });
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('h2.sec-title').forEach(function (el) {
    el.classList.add('fade-in');
    io.observe(el);
  });

  var rngSpeed = document.getElementById('rngSpeed');
  var rngRadius = document.getElementById('rngRadius');
  var lblSpeed = document.getElementById('lblSpeed');
  var lblRadius = document.getElementById('lblRadius');
  var simG = document.getElementById('simG');
  var simStatus = document.getElementById('simStatus');

  var corners = [
    { name: 'Eau Rouge, Spa', min: 0, max: 3.5 },
    { name: '130R, Suzuka', min: 3.5, max: 4.5 },
    { name: 'Copse, Silverstone', min: 4.5, max: 5.5 },
    { name: 'Turn 8, Istanbul Park', min: 5.5, max: 6.5 },
    { name: 'Theoretical extreme', min: 6.5, max: 99 }
  ];

  function updateSim() {
    if (!rngSpeed || !rngRadius || !lblSpeed || !lblRadius || !simG || !simStatus) return;

    var vKmh = parseFloat(rngSpeed.value);
    var r = parseFloat(rngRadius.value);
    var vMs = vKmh / 3.6;
    var g = (vMs * vMs) / (r * 9.81);

    lblSpeed.textContent = vKmh + ' km/h';
    lblRadius.textContent = r + ' m';
    simG.textContent = g.toFixed(1);

    var status, color;
    if (g < 2) {
      status = 'Comfortable — light steering load';
      color = 'var(--throttle)';
    } else if (g < 4) {
      status = 'Moderate — road-car extreme';
      color = 'var(--data)';
    } else if (g < 5.5) {
      status = 'Demanding — sustained neck load';
      color = 'var(--amber)';
    } else {
      status = 'F1 peak — full HANS & harness load';
      color = 'var(--brake)';
    }

    simStatus.textContent = status;
    simStatus.style.color = color;
    simStatus.style.borderColor = color;

    var match = corners[corners.length - 1];
    for (var i = 0; i < corners.length; i++) {
      if (g >= corners[i].min && g < corners[i].max) {
        match = corners[i];
        break;
      }
    }

    if (match) {
      console.log('Corner profile:', match.name);
    }
  }

  if (rngSpeed && rngRadius) {
    rngSpeed.addEventListener('input', updateSim);
    rngRadius.addEventListener('input', updateSim);
    updateSim();
  }

  var barChart = document.getElementById('barChart');
  if (barChart) {
    var barIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          var maxG = 9;
          e.target.querySelectorAll('.bar-row').forEach(function (row) {
            var g = parseFloat(row.getAttribute('data-g'));
            var fill = row.querySelector('.bar-fill');
            fill.style.width = (g / maxG * 100) + '%';
          });
          barIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    barIo.observe(barChart);
  }

  var calcSpeed = document.getElementById('calcSpeed');
  var calcRadius = document.getElementById('calcRadius');
  var calcSpeedLbl = document.getElementById('calcSpeedLbl');
  var calcRadiusLbl = document.getElementById('calcRadiusLbl');
  var calcG = document.getElementById('calcG');
  var calcScaleFill = document.getElementById('calcScaleFill');
  var calcNote = document.getElementById('calcNote');

  function updateCalc() {
    if (!calcSpeed || !calcRadius || !calcSpeedLbl || !calcRadiusLbl || !calcG || !calcScaleFill || !calcNote) return;

    var vKmh = parseFloat(calcSpeed.value);
    var r = parseFloat(calcRadius.value);
    var vMs = vKmh / 3.6;
    var g = (vMs * vMs) / (r * 9.81);

    calcSpeedLbl.textContent = vKmh + ' km/h';
    calcRadiusLbl.textContent = r + ' m';
    calcG.textContent = g.toFixed(1);

    var pct = Math.min(g / 9 * 100, 100);
    calcScaleFill.style.width = pct + '%';

    var note, color;
    if (g < 1) {
      note = 'Gentle — well within a road car\'s cornering limit.';
      color = 'var(--throttle)';
    } else if (g < 3) {
      note = 'Firm — close to a road car\'s maximum grip.';
      color = 'var(--data)';
    } else if (g < 5) {
      note = 'Heavy — approaching endurance-car and lower-formula territory.';
      color = 'var(--amber)';
    } else if (g < 7) {
      note = 'F1-level — the range drivers train their necks specifically to withstand.';
      color = 'var(--brake)';
    } else {
      note = 'Beyond typical F1 cornering — closer to a fighter jet\'s sustained-turn range.';
      color = 'var(--brake)';
    }

    calcScaleFill.style.background = color;
    calcNote.textContent = note;
  }

  if (calcSpeed && calcRadius) {
    calcSpeed.addEventListener('input', updateCalc);
    calcRadius.addEventListener('input', updateCalc);
    updateCalc();
  }
});
