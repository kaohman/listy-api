import request from 'supertest';
import '@babel/polyfill';
import app from './app';
import shortid from 'shortid'; 

describe('api', () => {
    let notes;
    beforeEach(() => {
        notes = [
            {
                id: 1,
                title: "Trapper Keeper",
                issues: [
                {
                    id: 21,
                    body: "Finish project",
                    completed: false
                },
                {
                    id: 22,
                    body: "Start project",
                    completed: false
                },
                {
                    id: 23,
                    body: "Test project",
                    completed: false
                },
                {
                    id: 24,
                    body: "Deploy to Heroku",
                    completed: false
                }
                ]
            },
            {
                id: 2,
                title: "Hello",
                issues: [{id: 25, body: "beep", completed: true}],
            }
        ];
        app.locals.notes = notes;
    });

    describe('get /api/v1/notes', () => {
        it('should return a 200', async () => {
            const response = await request(app).get('/api/v1/notes');
            expect(response.status).toBe(200);
        });

        it('should respond with an array of notes', async () => {
            const response = await request(app).get('/api/v1/notes');
            expect(response.body).toEqual(notes);
        });

        it('should return a 200 if the note exists', async () => {
            const response = await request(app).get('/api/v1/notes/1');
            expect(response.status).toBe(200);
        });

        it('should respond with the correct note if the note exists', async () => {
            const response = await request(app).get('/api/v1/notes/1');
            expect(response.body).toEqual(notes[0]);
        });

        it('should return a status of 404 if the note does not exist', async () => {
            const response = await request(app).get('/api/v1/notes/15');
            expect(response.status).toBe(404)
        });

        it('should return a message if the note is not found', async () => {
            const response = await request(app).get('/api/v1/notes/15');
            expect(response.body).toBe('Note not found')
        });
    });

    describe('post /api/v1/notes', () => {
        it('should return a 201 and a new note if everything is ok', async () => {
            const newNote = { title: 'Title1', issues: []}
            shortid.generate = jest.fn().mockImplementation(() => 10);
            const response = await request(app).post('/api/v1/notes')
                .send(newNote);
            expect(response.status).toBe(201);
            expect(response.body).toEqual({ id: 10, ...newNote }); 
        });

        it('should return a 422 and an error message if the title or body is wrong/blank', async () => {
            const newNote = { title: '', issues: []}
            shortid.generate = jest.fn().mockImplementation(() => 10);
            const response = await request(app).post('/api/v1/notes')
                .send(newNote);
            expect(response.status).toBe(422);
            expect(response.body).toEqual('Please provide a title and issues for your note'); 
        });
    });

    describe('put /api/v1/notes/:id', () => {
        it('should response with a status code of 204 and update the data model if everything is ok', async () => {
            expect(app.locals.notes[0]).toEqual(notes[0])
            const response = await request(app).put('/api/v1/notes/1')
                .send({ title: 'New Title', issues: []});
            expect(response.status).toBe(204);
            expect(app.locals.notes[0]).toEqual({ id: 1, title: 'New Title', issues: []});
        });

        it('should return a status code of 422 and an error message if the request body is not ok', async () => {
            expect(app.locals.notes[0]).toEqual(notes[0]);
            const response = await request(app).put('/api/v1/notes/1')
                .send({ titleee: '', issues: []});
            expect(response.status).toBe(422);
            expect(app.locals.notes[0]).toEqual(notes[0]);
        });

        it('should return a status code of 404 and an error message if the note is not found', async () => {
            expect(app.locals.notes[0]).toEqual(notes[0]);
            const response = await request(app).put('/api/v1/notes/19')
                .send({ title: 'New Title', issues: []});
            expect(response.status).toBe(404);
            expect(app.locals.notes[0]).toEqual(notes[0]);
        });
    });

    describe('delete /api/v1/notes/:id', () => {
        it('should delete a note and return a 204', async () => {
            expect(app.locals.notes[0].id).toEqual(1);
            const response = await request(app).delete('/api/v1/notes/1');
            expect(response.status).toBe(204);
            expect(app.locals.notes[0].id).toEqual(2)
        });

        it('should return a status code of 404 if the note is not there', async () => {
            expect(app.locals.notes[0].id).toEqual(1);
            const response = await request(app).delete('/api/v1/notes/12');
            expect(response.status).toBe(404);
            expect(response.body).toBe('Note not found');
            expect(app.locals.notes[0].id).toEqual(1);
        });
    });
});