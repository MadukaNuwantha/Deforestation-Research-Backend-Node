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

describe("File", () => {
    let token = ""

    it("Should create a user", async () => {
        const res = await request(app)
            .post("/api/user/")
            .send({
                username: "fileUploader",
                email: "uploader@mail.com",
                password: "secret",
                type: "manager"
            })
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("type")
        expect(res.body.type).toMatch("manager")
        expect(res.body).toHaveProperty("token")

        token = res.body.token
    });

    it("Should get all files of user", async () => {
        const res = await request(app)
            .get("/api/file/")
            .set({
                "x-auth-token": token
            })
            .send()
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty("status")
        expect(res.body.status).toMatch("success")
        expect(res.body).toHaveProperty("result")
    });
});