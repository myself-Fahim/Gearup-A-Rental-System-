import app from "./app";
import config from "./config";



if (config.node_env != 'production') {
    app.listen(3000, () => {
        console.log('Server is running at http://localhost:3000');
    })

}

export default app