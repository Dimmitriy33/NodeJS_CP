import { Express, Request, Response } from "express";

export default function routes(app: Express) {
    app.get("/testAPI", (req: Request, res: Response) => {
        res.sendStatus(200);
    });
}