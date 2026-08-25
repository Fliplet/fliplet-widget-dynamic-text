/**
 * Guards the bundled moment-timezone data in js/moment-timezone.js.
 *
 * The file is a `build` asset, so it loads in published apps and overwrites moment.tz
 * for the whole screen: whatever data it carries becomes the data every other script on
 * that screen sees. js/build.js renderDateTime() then feeds an arbitrary data source
 * value through moment(VALUE).tz(timezone), so stale IANA rules render a stored date at
 * the wrong time -- silently, with nothing in the console.
 *
 * It shipped 0.5.36 / IANA 2022c, which was wrong for 29 zones (DEV-1813). These tests
 * pin the properties that a future swap can quietly break.
 */

const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');

const BUNDLE = path.join(__dirname, '..', 'js', 'moment-timezone.js');
const INTERFACE = path.join(__dirname, '..', 'js', 'interface.js');

const moment = require(BUNDLE);
const source = fs.readFileSync(BUNDLE, 'utf8');

// The zones js/interface.js offers in its "Select timezone" dropdown. Anything in this
// list is reachable by configuration, so all of it must exist in the bundled data.
const dropdownZones = (function() {
  const src = fs.readFileSync(INTERFACE, 'utf8');
  const start = src.indexOf('const TIMEZONES_OPTIONS = [');
  const end = src.indexOf('].sort(', start);

  assert.ok(start !== -1 && end > start, 'could not locate TIMEZONES_OPTIONS in js/interface.js');

  return (src.slice(start, end).match(/'[^']+'/g) || []).map(function(entry) {
    return entry.slice(1, -1);
  });
})();

// IANA release the bundled data must be at or beyond. 2026c carries Mexico's 2022 DST
// abolition, Greenland, Egypt, Morocco, Paraguay and the Canadian changes; anything
// older converts those zones an hour out. See DEV-1813.
const MINIMUM_DATA_VERSION = '2026c';

// How far the bundled data may fall behind the calendar before this suite calls it
// stale. The runtime-drift check below is the primary alarm and fires as soon as the
// runner knows newer rules; this is the backstop for a runner whose own tzdata is older
// than the bundle. The file sat four years out of date before anyone noticed, which is
// what this bound exists to stop.
const MAXIMUM_DATA_AGE_YEARS = 2;

function parseDataVersion(version) {
  const parts = /^(\d{4})([a-z]*)$/.exec(version);

  assert.ok(parts, 'unrecognised IANA data version: ' + version);

  return { year: parseInt(parts[1], 10), release: parts[2] };
}

// IANA versions are a year plus a lowercase release suffix, so within a year a longer
// suffix sorts after a shorter one and equal lengths compare directly.
function compareDataVersions(left, right) {
  const a = parseDataVersion(left);
  const b = parseDataVersion(right);

  if (a.year !== b.year) {
    return a.year < b.year ? -1 : 1;
  }

  if (a.release.length !== b.release.length) {
    return a.release.length < b.release.length ? -1 : 1;
  }

  if (a.release === b.release) {
    return 0;
  }

  return a.release < b.release ? -1 : 1;
}

test('bundled IANA data is current', function() {
  assert.ok(
    compareDataVersions(moment.tz.dataVersion, MINIMUM_DATA_VERSION) >= 0,
    'bundled IANA data is ' + moment.tz.dataVersion + ', expected ' + MINIMUM_DATA_VERSION + ' or newer'
  );
});

test('bundled IANA data is not behind the runtime tzdata', function(t) {
  // Node ships its own IANA release for Intl and it moves on every runtime upgrade. If
  // it has overtaken the bundle then newer rules exist that this widget is not
  // converting against, which is exactly the DEV-1813 defect. Unlike
  // MINIMUM_DATA_VERSION this needs no maintenance: it starts failing on its own.
  if (!process.versions.tz) {
    return t.skip('this Node build does not report its tzdata version');
  }

  assert.ok(
    compareDataVersions(moment.tz.dataVersion, process.versions.tz) >= 0,
    'bundled IANA data is ' + moment.tz.dataVersion + ' but this Node runtime already has '
      + process.versions.tz + '; refresh js/moment-timezone.js and raise MINIMUM_DATA_VERSION'
  );
});

test('bundled IANA data has not fallen behind the calendar', function() {
  const bundledYear = parseDataVersion(moment.tz.dataVersion).year;
  const oldestAcceptableYear = new Date().getUTCFullYear() - MAXIMUM_DATA_AGE_YEARS;

  assert.ok(
    bundledYear >= oldestAcceptableYear,
    'bundled IANA data is from ' + bundledYear + ', more than ' + MAXIMUM_DATA_AGE_YEARS
      + ' years old; refresh js/moment-timezone.js and raise MINIMUM_DATA_VERSION'
  );
});

test('zones corrected by IANA 2026c resolve to the current offset', function() {
  // [zone, instant, expected minutes to subtract from local time to reach UTC].
  // Every case here is one the replaced 0.5.36 / 2022c build got wrong.
  const cases = [
    // Mexico abolished DST in 2022; the old data still applied a summer shift.
    ['America/Mexico_City', '2027-07-15T12:00:00Z', 360],
    ['America/Monterrey', '2027-07-15T12:00:00Z', 360],
    ['America/Merida', '2027-07-15T12:00:00Z', 360],
    ['America/Mazatlan', '2027-07-15T12:00:00Z', 420],
    ['America/Bahia_Banderas', '2027-07-15T12:00:00Z', 360],
    ['America/Chihuahua', '2027-01-15T12:00:00Z', 360],
    ['America/Ojinaga', '2027-01-15T12:00:00Z', 360],
    // Greenland moved to UTC-2/-1 and now shifts with Europe.
    ['America/Godthab', '2027-07-15T12:00:00Z', 60],
    ['America/Nuuk', '2027-07-15T12:00:00Z', 60],
    ['America/Scoresbysund', '2027-07-15T12:00:00Z', 60],
    // Egypt reinstated DST in 2023.
    ['Africa/Cairo', '2027-07-15T12:00:00Z', -180],
    // Morocco's permanent UTC+0.
    ['Africa/Casablanca', '2027-01-15T12:00:00Z', 0],
    // Paraguay abolished DST in 2024.
    ['America/Asuncion', '2027-04-15T12:00:00Z', 180],
    // Canada, Kazakhstan, Jordan, Syria, Fiji and Antarctic base changes.
    ['America/Vancouver', '2027-01-15T12:00:00Z', 420],
    ['Asia/Almaty', '2027-07-15T12:00:00Z', -300],
    ['Asia/Qostanay', '2027-07-15T12:00:00Z', -300],
    ['Asia/Amman', '2027-01-15T12:00:00Z', -180],
    ['Asia/Damascus', '2027-01-15T12:00:00Z', -180],
    ['Pacific/Fiji', '2027-01-15T12:00:00Z', -720],
    ['Antarctica/Casey', '2027-07-15T12:00:00Z', -480],
    ['Antarctica/Vostok', '2027-07-15T12:00:00Z', -300]
  ];

  cases.forEach(function(testCase) {
    const zone = moment.tz.zone(testCase[0]);

    assert.ok(zone, testCase[0] + ' is missing from the bundled data');
    assert.strictEqual(
      zone.utcOffset(Date.parse(testCase[1])),
      testCase[2],
      testCase[0] + ' has a stale offset at ' + testCase[1]
    );
  });
});

test('every timezone offered in the dropdown exists in the bundled data', function() {
  assert.ok(dropdownZones.length > 300, 'failed to read the timezone list from js/interface.js');

  // js/build.js:394 calls moment(VALUE).tz(timezone) with the configured value. A name
  // the data does not know does not throw -- moment-timezone logs to the console and
  // leaves the time unconverted -- so a dropped zone is silently the wrong time.
  const missing = dropdownZones.filter(function(name) {
    return !moment.tz.zone(name);
  });

  assert.deepStrictEqual(missing, [], 'offered in the dropdown but missing from the bundled data');
});

test('every advertised zone name resolves', function() {
  // Guards the link-chain defect found on DEV-1686 / PR #795: a custom build that
  // filters years leaves links pointing at links ("A|B" plus "B|C"), and getZone
  // resolves only ONE level, so 139 names silently returned null. Note that
  // names().length alone does not catch it -- names() omits broken zones rather than
  // listing them, so the count drops instead of a lookup failing.
  const unresolved = moment.tz.names().filter(function(name) {
    return !moment.tz.zone(name);
  });

  assert.deepStrictEqual(unresolved, []);
  assert.ok(moment.tz.names().length >= 597, 'expected at least 597 zone names, got ' + moment.tz.names().length);
});

test('bundled data keeps the full historical and future range', function() {
  // Deliberately the full-data build, NOT the trimmed 2015-2100 span that
  // fliplet-widget-dynamic-lists ships (DEV-1686). That widget only compares against
  // "now"; this one converts stored record values, which can predate any trimmed span.
  const untils = moment.tz.zone('Europe/London').untils;

  assert.ok(
    new Date(untils[1]).getUTCFullYear() < 1950,
    'bundled data starts too late to be the full-data build -- a trimmed build breaks historical records'
  );
  assert.ok(
    new Date(untils[untils.length - 2]).getUTCFullYear() > 2400,
    'bundled data ends too early to be the full-data build -- a short span is what caused DEV-1686'
  );
});

test('historical record dates still convert correctly', function() {
  // The concrete regression a trimmed build would introduce: on the 2015-2100 span
  // these three are an hour out, because the date falls before the first transition and
  // moment-timezone falls back to a fixed offset.
  assert.strictEqual(moment('1995-07-15T12:00:00Z').tz('America/New_York').format('HH:mm Z'), '08:00 -04:00');
  assert.strictEqual(moment('2010-07-15T12:00:00Z').tz('Europe/London').format('HH:mm Z'), '13:00 +01:00');
  assert.strictEqual(moment('2013-07-15T12:00:00Z').tz('Australia/Sydney').format('HH:mm Z'), '22:00 +10:00');
});

test('the header comment describes what the file actually contains', function() {
  const header = source.slice(0, 400);

  assert.ok(header.includes('moment-timezone ' + moment.tz.version),
    'header does not state the bundled library version (' + moment.tz.version + ')');
  assert.ok(header.includes('IANA ' + moment.tz.dataVersion),
    'header does not state the bundled IANA version (' + moment.tz.dataVersion + ')');
});

test('the js/build.js call sites keep working', function() {
  // renderDateTime(): moment(VALUE).tz(timezone) for "Convert to another timezone".
  assert.strictEqual(
    moment('2029-06-12T14:00:00Z').tz('America/New_York').format('HH:mm Z'),
    '10:00 -04:00'
  );
  // The same path through an alias rather than a base zone.
  assert.strictEqual(
    moment('2029-06-12T14:00:00Z').tz('America/Toronto').format('HH:mm Z'),
    '10:00 -04:00'
  );
  // renderDateTime() else-branch: moment.utc(VALUE) when no conversion is configured.
  assert.strictEqual(
    moment.utc('2029-06-12T14:00:00Z').format('YYYY-MM-DD HH:mm:ss'),
    '2029-06-12 14:00:00'
  );
});
