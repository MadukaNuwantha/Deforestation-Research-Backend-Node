const app = require('../index')
require('dotenv').config()
const request = require('supertest')
const mongo = require('mongoose')


beforeEach(async () => {
    await mongo.connect(process.env.DB);
});


afterEach(async () => {
    await mongo.connection.close();
});

const testObjects = {
    manager: {
        username: "test manager",
        email: "testuser@mail.com",
        password: "secret",
        type: "manager"
    },
    shouldFailWorker: {
        username: "test worker",
        email: "testuser@mail.com",
        password: "secret",
        type: "worker"
    },
    worker: {
        username: "test worker",
        email: "testworker@mail.com",
        password: "secret",
        type: "worker"
    }
}

let token = ""

describe("User", () => {
    it("Should get all users", async () => {
        const res = await request(app).get("/api/user/");
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("result")
    });

    it("Should fail to login", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: "no",
                password: "wrong"
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("fail")
        expect(res.body).toHaveProperty("result")
        expect(res.body.result).toMatch("User not found")
    });

    it("Should create a manager", async () => {
        const res = await request(app)
            .post("/api/user/")
            .send(testObjects.manager)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("type")
        expect(res.body.type).toMatch(testObjects.manager.type)
        expect(res.body).toHaveProperty("token")

        token = res.body.token
    });

    it("Should fail to login as manager", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: testObjects.manager.email,
                password: "wrong"
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("fail")
        expect(res.body).toHaveProperty("result")
        expect(res.body.result).toMatch("Incorrect password")
    });

    it("Should login as manager", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: testObjects.manager.email,
                password: testObjects.manager.password
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("type")
        expect(res.body.type).toMatch(testObjects.manager.type)
        expect(res.body).toHaveProperty("token")

        token = res.body.token
    });

    it("Should auth manager", async () => {
        const res = await request(app)
            .post("/api/user/auth")
            .set({
                "x-auth-token": token
            })
            .send()
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("result")
        expect(res.body.result).toMatchObject({
            "username": testObjects.manager.username,
            "email": testObjects.manager.email,
            "type": testObjects.manager.type,
        })
    });

    it("Should fail to create a worker", async () => {
        const res = await request(app)
            .post("/api/user/")
            .send(testObjects.shouldFailWorker)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("fail")
        expect(res.body).toHaveProperty("result")
        expect(res.body.result).toMatch("A user with this email already exists")

        token = res.body.token
    });

    it("Should create a worker", async () => {
        const res = await request(app)
            .post("/api/user/")
            .send(testObjects.worker)
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("type")
        expect(res.body.type).toMatch(testObjects.worker.type)
        expect(res.body).toHaveProperty("token")

        token = res.body.token
    });

    it("Should fail to login as worker", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: testObjects.worker.email,
                password: "wrong"
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("fail")
        expect(res.body).toHaveProperty("result")
        expect(res.body.result).toMatch("Incorrect password")
    });

    it("Should login as worker", async () => {
        const res = await request(app)
            .post("/api/user/login")
            .send({
                email: testObjects.worker.email,
                password: testObjects.worker.password
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("type")
        expect(res.body.type).toMatch(testObjects.worker.type)
        expect(res.body).toHaveProperty("token")

        token = res.body.token
    });

    it("Should auth manager", async () => {
        const res = await request(app)
            .post("/api/user/auth")
            .set({
                "x-auth-token": token
            })
            .send()
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("result")
        expect(res.body.result).toMatchObject({
            "username": testObjects.worker.username,
            "email": testObjects.worker.email,
            "type": testObjects.worker.type,
        })
    });
});