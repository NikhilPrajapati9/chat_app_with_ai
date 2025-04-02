import * as ai from "../services/ai.service.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const getResult = asyncHandler(async (req, res) => {
    const { prompt } = req.query;

    const result = await ai.generateResult(prompt);

    return res.send(result)
}) 