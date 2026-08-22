export default async function handler(req, res) {

    try {

        const { url, reaction } = req.query;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL channel belum diisi"
            });
        }

        if (!reaction) {
            return res.status(400).json({
                success: false,
                message: "Reaction belum diisi"
            });
        }


        // API KEY
        const API_KEY = "DennnCodee";


        // API NEXADEV
        const apiUrl =
            "https://api.nexadev.my.id/api/rch" +
            "?key=" + encodeURIComponent(API_KEY) +
            "&url=" + encodeURIComponent(url) +
            "&reaction=" + encodeURIComponent(reaction);


        const response = await fetch(apiUrl);


        const data = await response.json();


        return res.status(response.status).json(data);


    } catch (error) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message: "Gagal menghubungi API",

            error: error.message

        });

    }

}
