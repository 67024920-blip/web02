const express = require('express');
const path = require('path');
const mysql = require("mysql2");

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "hospital"
});

const app = express();
const hostname = '127.0.0.1';
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "project-main"));

app.use(express.static('static'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const rateLimit = require("express-rate-limit");

const patientLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 นาที
    max: 10, // ส่งได้ 10 ครั้ง / IP
    message: "Too many requests, please try again later"
});

app.post("/patient",patientLimiter, (req, res) => {

    const toDashIfNull = (val) =>
        (val === null || val === undefined || val === "") ? "-" : val;

    const toNullIfEmpty = (val) =>
        (val === null || val === undefined || val === "") ? null : val;

    const {
        p_id, p_name, p_surname, p_dob,
        p_subdistrict_home, p_district_home, p_province_home,
        p_phone, p_job, p_race, p_nat, p_rel, p_blood,
        p_father, p_mother, p_spouse,
        p_em_phone,
        rights, a_id, i_id,
        AD, DR, DS,datetime,Adoc_id,reason
    } = req.body;

    // 1) หา HN ล่าสุด
    const sqlLastHN = `
        SELECT HN FROM petient
        ORDER BY HN DESC
        LIMIT 1
    `;

    pool.query(sqlLastHN, (err, rows) => {
        if (err) return res.status(500).send(err);

        let running = 1;
        if (rows.length > 0) {
            running = parseInt(rows[0].HN.replace("HN", "")) + 1;
        }

        const hn = `HN${running.toString().padStart(5, "0")}`;

        // 2) INSERT patient
        const sqlPatient = `
            INSERT INTO petient (
                HN, cid, firstname, lastname, birthdate,
                s_dis, dis, province,
                phone, career, ethnicity, nationality, religion, blood,
                father, mother, spouse, emergency_number,
                insurance, insurance_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const patientValues = [
            hn,
            toDashIfNull(p_id),
            toDashIfNull(p_name),
            toDashIfNull(p_surname),
            toDashIfNull(p_dob),

            toDashIfNull(p_subdistrict_home),
            toDashIfNull(p_district_home),
            toDashIfNull(p_province_home),

            toDashIfNull(p_phone),
            toDashIfNull(p_job),
            toDashIfNull(p_race),
            toDashIfNull(p_nat),
            toDashIfNull(p_rel),
            toDashIfNull(p_blood),

            toDashIfNull(p_father),
            toDashIfNull(p_mother),
            toDashIfNull(p_spouse),

            toDashIfNull(p_em_phone),
            toDashIfNull(rights),
            toNullIfEmpty(i_id)
        ];

        pool.query(sqlPatient, patientValues, (err) => {
            if (err) return res.status(500).send(err);

            // 3) INSERT appointment (ถ้ามี)
            if (a_id && a_id !== "-") {
                const sqlAppointment = `
                    INSERT INTO appointment 
                    (HN, Appointment_ID, datetime, doc_id, reason)
                    VALUES (?,?,?,?,?)
                `;

                pool.query(
                    sqlAppointment,
                    [
                        hn,
                        toNullIfEmpty(a_id),
                        toNullIfEmpty(datetime),
                        toNullIfEmpty(Adoc_id),
                        toDashIfNull(reason)
                    ],
                    (err) => {
                        if (err) console.error(err);
                    }
                );
            }

            // 4) INSERT allergy (หลายรายการ)
            if (
                Array.isArray(AD) &&
                AD.some(drug => drug && drug.trim() !== "")
            ) {
                const sqlAllergy = `
                    INSERT INTO allergy (HN, drugID, Reaction, Severity)
                    VALUES (?,?,?,?)
                `;

                AD.forEach((drug, i) => {
                    if (drug && drug.trim() !== "") {
                        pool.query(
                            sqlAllergy,
                            [
                                hn,
                                toNullIfEmpty(drug),
                                toDashIfNull(DR?.[i]),
                                toDashIfNull(DS?.[i])
                            ],
                            (err) => {
                                if (err) console.error(err);
                            }
                        );
                    }
                });
            }
            res.redirect("/patient-list");
        });
    });
});


app.post("/public-patient",patientLimiter, (req, res) => {

    const toDashIfNull = (val) =>
        (val === null || val === undefined || val === "") ? "-" : val;

    const toNullIfEmpty = (val) =>
        (val === null || val === undefined || val === "") ? null : val;

    const {
        p_id, p_name, p_surname, p_dob,
        p_subdistrict_home, p_district_home, p_province_home,
        p_phone, p_job, p_race, p_nat, p_rel, p_blood,
        p_father, p_mother, p_spouse,
        p_em_phone,
        rights, a_id, i_id,
        AD, DR, DS
    } = req.body;

    // 1) หา HN ล่าสุด
    const sqlLastHN = `
        SELECT HN FROM petient
        ORDER BY HN DESC
        LIMIT 1
    `;

    pool.query(sqlLastHN, (err, rows) => {
        if (err) return res.status(500).send(err);

        let running = 1;
        if (rows.length > 0) {
            running = parseInt(rows[0].HN.replace("HN", "")) + 1;
        }

        const hn = `HN${running.toString().padStart(5, "0")}`;

        // 2) INSERT patient
        const sqlPatient = `
            INSERT INTO petient (
                HN, cid, firstname, lastname, birthdate,
                s_dis, dis, province,
                phone, career, ethnicity, nationality, religion, blood,
                father, mother, spouse, emergency_number,
                insurance, insurance_id
            ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `;

        const patientValues = [
            hn,
            toDashIfNull(p_id),
            toDashIfNull(p_name),
            toDashIfNull(p_surname),
            toDashIfNull(p_dob),

            toDashIfNull(p_subdistrict_home),
            toDashIfNull(p_district_home),
            toDashIfNull(p_province_home),

            toDashIfNull(p_phone),
            toDashIfNull(p_job),
            toDashIfNull(p_race),
            toDashIfNull(p_nat),
            toDashIfNull(p_rel),
            toDashIfNull(p_blood),

            toDashIfNull(p_father),
            toDashIfNull(p_mother),
            toDashIfNull(p_spouse),

            toDashIfNull(p_em_phone),
            toDashIfNull(rights),
            toNullIfEmpty(i_id)
        ];

        pool.query(sqlPatient, patientValues, (err) => {
            if (err) return res.status(500).send(err);

            // 3) INSERT appointment (ถ้ามี)
            if (a_id && a_id !== "-") {
                const sqlAppointment = `
                    INSERT INTO appointment (HN, Appointment_ID)
                    VALUES (?,?)
                `;

                pool.query(
                    sqlAppointment,
                    [hn, toNullIfEmpty(a_id)],
                    (err) => {
                        if (err) console.error(err);
                    }
                );
            }

            // 4) INSERT allergy (หลายรายการ)
            if (
                Array.isArray(AD) &&
                AD.some(drug => drug && drug.trim() !== "")
            ) {
                const sqlAllergy = `
                    INSERT INTO allergy (HN, drugID, Reaction, Severity)
                    VALUES (?,?,?,?)
                `;

                AD.forEach((drug, i) => {
                    if (drug && drug.trim() !== "") {
                        pool.query(
                            sqlAllergy,
                            [
                                hn,
                                toNullIfEmpty(drug),
                                toDashIfNull(DR?.[i]),
                                toDashIfNull(DS?.[i])
                            ],
                            (err) => {
                                if (err) console.error(err);
                            }
                        );
                    }
                });
            }
            res.redirect("/public-form");
        });
    });
});


app.get("/patient-list", (req, res) => {

    const editHN = req.query.edit;
    const search = req.query.search?.trim();
    
    let sql = `
        SELECT 
            p.*,
            h.Date,
            h.hospital,
            h.doc_id,
            h.symptoms,
            h.Diagnosis
        FROM petient p
        LEFT JOIN history h ON p.HN = h.HN
    `;

    let params = [];

    // 🔍 ถ้ามีการค้นหา → ใส่ WHERE
    if (search) {
        sql += `
            WHERE
                p.firstname LIKE ?
                OR p.lastname LIKE ?
                OR p.cid LIKE ?
                OR p.HN LIKE ?
        `;
        const keyword = `%${search}%`;
        params = [keyword, keyword, keyword, keyword];
    }

    // เรียงลำดับเหมือนเดิม
    sql += ` ORDER BY p.HN DESC, h.Date DESC`;

    pool.query(sql, params, (err, rows) => {
        if (err) return res.status(500).send(err);

        const map = {};

        rows.forEach(r => {
            if (!map[r.HN]) {
                map[r.HN] = {
                    ...r,
                    visits: []
                };
            }

            if (r.Date) {
                map[r.HN].visits.push({
                    date: r.Date,
                    hospital: r.hospital,
                    doctor: r.doc_id,
                    symptoms: r.symptoms,
                    diagnosis: r.Diagnosis
                });
            }
        });

        const patients = Object.values(map);

        const editPatient = editHN
            ? patients.find(p => p.HN === editHN)
            : null;

        res.render("patient-list", {
            patients,
            editPatient,
            search: search || ""
        });
    });
});

app.get('/dashboard', (req, res) => {
    const sql = `SELECT COUNT(*) AS total FROM petient`;

    pool.query(sql, (err, rows) => {
        if (err) return res.status(500).send(err);

        res.render("dashboard", {
            totalPatients: rows[0].total
        });
    });
});

app.post("/patient/update", (req, res) => {
    const {
        HN, firstname, lastname, cid, blood, phone,
        career, s_dis, dis, province, insurance, insurance_id
    } = req.body;

    const sql = `
        UPDATE petient SET
            firstname = ?,
            lastname = ?,
            cid = ?,
            blood = ?,
            phone = ?,
            career = ?,
            s_dis = ?,
            dis = ?,
            province = ?,
            insurance = ?,
            insurance_id = ?
        WHERE HN = ?
    `;

    pool.query(sql, [
        firstname, lastname, cid, blood, phone,
        career, s_dis, dis, province, insurance, insurance_id, HN
    ], err => {
        if (err) return res.status(500).send(err);
        res.redirect("/patient-list");
    });
});

app.post("/patient/delete", (req, res) => {
    const { HN } = req.body;

    pool.query(
        "DELETE FROM petient WHERE HN = ?",
        [HN],
        err => {
            if (err) return res.status(500).send(err);
            res.redirect("/patient-list");
        }
    );
});


/* ---------- STATIC FILES ---------- */
// แทนที่ serveFile + mimeTypes + fs ทั้งหมด

app.use('/static', express.static(path.join(__dirname, 'static')));


/* ---------- ROUTES ---------- */


app.get('/Usertype', (req, res) => {
    res.sendFile(path.join(__dirname, 'project-main', 'Usertype.html'));
});

// เข้าเว็บ → เด้งไป login

// หน้า login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'project-main', 'login.html'));
});


app.get('/public-form', (req, res) => {
    res.sendFile(path.join(__dirname, 'project-main', 'public-form.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'project-main', 'register.html'));
});

// หน้า dashboard
app.get('/', (req, res) => {
    res.redirect('/Usertype');
});
// 404
app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}`);
});