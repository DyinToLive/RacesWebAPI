
const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(supabaseUrl, supabaseKey);
const app = express();
const PORT = 8080;

// Route that returns the seasons supported by the API (that is, all the
// data in the seasons table).
app.get('/api/seasons', async (req, res) => { 
    const {data, error} = await supabase 
    .from('seasons') 
    .select(`*`) 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No seasons found.' });
    }
   });

// Route that returns all of the circuits.
app.get('/api/circuits', async (req, res) => { 
    const {data, error} = await supabase 
    .from('circuits') 
    .select(`*`) 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No circuits found.' });
    }
   });

// Returns the circuits used in a given season (order by round
// in ascending order), e.g., /api/circuits/season/2020
app.get('/api/circuits/season/:year', async (req, res) => { 
    const {data, error} = await supabase 
    .from('races') 
    .select(`
        circuits!inner (name, location, country)
    `) 
    .eq('year',req.params.year)
    .order('round', { ascending: true })
    
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No seasons found for that year.' });
    }
   });

// Route that returns referenced circuit using the circuitRef field.
app.get('/api/circuits/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('circuits') 
    .select(`*`) 
    .eq('circuitRef', req.params.ref)
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No circuits found.' });
    }
});

// Route that returns all of the constructors.
app.get('/api/constructors', async (req, res) => { 
    const {data, error} = await supabase 
    .from('constructors') 
    .select(`*`) 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No constructors found.' });
    }
});

// Route that returns referenced constructor using the constructorRef field.
app.get('/api/constructors/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('constructors') 
    .select(`*`) 
    .eq('constructorRef', req.params.ref)
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No constructors found.' });
    }
});


// Route that returns all of the drivers.
app.get('/api/drivers', async (req, res) => { 
    const {data, error} = await supabase 
    .from('drivers') 
    .select(`*`) 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No drivers found.' });
    }
});

// Route that returns referenced driver using the driversRef field.
app.get('/api/drivers/:ref', async (req, res) => { 
    const {data, error} = await supabase 
    .from('drivers') 
    .select(`*`) 
    .eq('driverRef', req.params.ref)
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No driver found.' });
    }
});

// Returns the drivers whose surname (case insensitive) begins
// with the provided substring, e.g., /api/drivers/search/sch
app.get('/api/drivers/search/:startsWith', async (req, res) => {
    const startsWith = req.params.startsWith.toLowerCase();
    
    // Fetch drivers data from Supabase
    const { data: driversData, error } = await supabase
        .from('drivers')
        .select('*')
        .ilike('surname', `${startsWith}%`)
        .order('surname', { ascending: true })

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (driversData.length > 0) {
        res.json(driversData);
    } else {
        res.status(404).json({ error: 'No drivers found with the specified surname prefix' });
    }
});

//Returns the drivers within a given race, e.g., /api/drivers/race/1106
app.get('/api/drivers/race/:raceID', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('qualifying') 
        .select(` 
            raceId, drivers!inner (forename,surname)
        `) 
        .eq('raceId',req.params.raceID) 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No race with the provided race ID to return driver data.' });
    }
});

// Returns just the specified race. Don’t provide the foreign key
// for the circuit; instead provide the circuit name, location,
// and country.
app.get('/api/races/:raceID', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('races') 
        .select(` 
            name, circuits!inner (name, location, country)
        `) 
        .eq('raceId',req.params.raceID) 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No race with the provided race ID to return race data.' });
    }
});

// Returns the races within a given season ordered by round,
// e.g., /api/races/season/2020
app.get('/api/races/season/:year', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('races') 
        .select(` 
            name
        `) 
        .eq('year',req.params.year)
        .order('round', { ascending: true }); 
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No race with the provided race ID to return race data.' });
    }
});

// Returns a specific race within a given season specified by the
// round number, e.g., to return the 4 th race in the 2022
// season: /api/races/season/2022/4
app.get('/api/races/season/:year/:round', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('races') 
        .select(` 
            name
        `) 
        .eq('year',req.params.year)
        .eq('round', req.params.round)

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found with the provided year and round.' });
    }
});
// Returns all the races for a given circuit (use the circuitRef
// field), ordered by year, e.g. /api/races/circuits/monza
app.get('/api/races/circuits/:ref', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('races') 
        .select(` 
            name, year, circuits!inner (name,location, country, circuitRef)
        `) 
        .eq('circuits.circuitRef',req.params.ref)
        .order('year', {ascending: true})

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found with the provided circuit reference.' });
    }
});

// Returns all the races for a given circuit between two years.
app.get('/api/races/circuits/:ref/seasons/:startYear/:endYear', async (req, res) => {
    const startYear = parseInt(req.params.startYear);
    const endYear = parseInt(req.params.endYear);
    const reference = req.params.ref;

    // Fetch races data from Supabase
    const { data, error } = await supabase
        .from('races')
        .select(`
                name, year, circuits!inner (name,location, country, circuitRef)
            `)
        .eq('circuits.circuitRef',reference)
        .gte('year', startYear)
        .lte('year', endYear)

    if (startYear > endYear){
        return res.status(404).json({ error: 'Cannot have a starting year greater than ending year.' });
    }

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found with the provided years or circuit reference.' });
    }
});

// Returns the results for the specified race.
app.get('/api/results/:raceID', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('results') 
        .select(` 
            grid, drivers (driverRef, code, forename, surname), races (name, round, year, date),
            constructors (name, constructorRef, nationality)
        `) 
        .eq('raceId',req.params.raceID)
        .order('grid', {ascending: true})
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No race with the provided race ID to return data.' });
    }
});

// Returns all the results for a given driver, e.g.,
// /api/results/driver/max_verstappen
app.get('/api/results/driver/:ref', async (req, res) => {
    // Fetch drivers data from Supabase
    const {data, error} = await supabase 
        .from('results') 
        .select(` 
            races!inner (name), number, grid, position, positionText, positionOrder, points, laps, time,
            fastestLap, rank, fastestLapTime, fastestLapSpeed, drivers!inner (driverRef)
        `) 
        .eq('drivers.driverRef',req.params.ref)
    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No driver with the provided driver reference ID to return data.' });
    }
});

// Returns all the results for a given driver between years.
app.get('/api/results/driver/:ref/seasons/:startYear/:endYear', async (req, res) => {
    const startYear = parseInt(req.params.startYear);
    const endYear = parseInt(req.params.endYear);

    // Fetch races data from Supabase
    const { data, error } = await supabase
        .from('results')
        .select(` 
            races!inner (year), number, grid, position, positionText, positionOrder, points, laps, time,
            fastestLap, rank, fastestLapTime, fastestLapSpeed, drivers!inner (driverRef, driverId)
        `) 
        .eq('drivers.driverRef',req.params.ref)
        .gte('races.year', startYear)
        .lte('races.year', endYear)

    if (startYear > endYear){
        return res.status(404).json({ error: 'Cannot have a starting year greater than ending year.' });
    }

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found with the provided years or driver reference.' });
    }
});

// Return all the qualifying results for the specified race.
app.get('/api/qualifying/:raceID', async (req, res) => { 
    const {data, error} = await supabase 
    .from('results') 
    .select(` 
        grid, drivers (driverRef, code, forename, surname), races (name, round, year, date),
        constructors (name, constructorRef, nationality), qualifying!inner (raceId)
    `) 
    .eq('raceId',req.params.raceID) 
    .order('positionOrder', { ascending: true }); 

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found for the provided race ID' });
    }
});

// Returns the current season driver standings table for the
// specified race, sorted by position in ascending order.
// Provide the same fields as with results for the driver.
app.get('/api/standings/:raceID/drivers', async (req, res) => { 
    const {data, error} = await supabase 
    .from('driverStandings') 
    .select(` 
        raceId, drivers (driverRef, code, forename, surname), races!inner (raceId)
    `) 
    .eq('races.raceId',req.params.raceID) 
    .order('position', { ascending: true }); 

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found for the provided race ID' });
    }
});
// Returns the current season constructors standings table for
// the specified race, sorted by position in ascending order.
// Provide the same fields as with results for the constructor.
app.get('/api/standings/:raceID/constructors', async (req, res) => { 
    const {data, error} = await supabase 
    .from('constructorStandings') 
    .select(` 
        raceId, constructors (name, constructorRef, nationality), races!inner (raceId)
    `) 
    .eq('races.raceId',req.params.raceID) 
    .order('position', { ascending: true }); 

    if (error) {
        return res.status(500).json({ error: 'Internal Server Error' });
    }
    
    if (data.length > 0) {
        res.json(data);
    } else {
        res.status(404).json({ error: 'No data found for the provided race ID' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

