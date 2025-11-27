require('dotenv').config();
import bodyParser from 'body-parser';
import express from 'express';
import cors from "cors";
import path from "path";
import routes from './routes/index';
import nodeCron from 'node-cron';
import StudyScheduleService from './services/schedule.study.service';
import swaggerUi from 'swagger-ui-express';
import {specs, swaggerOptions} from './config/swagger.jsdoc';
import morgan from 'morgan';

const app = express();


app.use(morgan('dev'));
app.use(express.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
// route cho api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, swaggerOptions));

// routes chung cho tat ca cac api
app.use('/', routes);

//cho xem tai lieu
app.use("/resources", express.static(path.join(__dirname, "../resources")));

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

app.listen(PORT, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  console.log(`Swagger docs at http://${HOST}:${PORT}/api-docs`);
  nodeCron.schedule('*/1 * * * *', async () => {
    // chay 1 phut 1 lan de test
    console.log('--- Bắt đầu tác vụ Cron: Kiểm tra và đánh dấu lịch quá hạn ---');
    await StudyScheduleService.markOverTime();
    console.log('--- Kết thúc tác vụ Cron ---');
  });
});
