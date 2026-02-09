// --- เก็บโค้ดไอคอน SVG ไว้ในตัวแปร (เพื่อให้เรียกใช้ง่ายและแก้ไขที่เดียวจบ) ---
const svgIcons = {
    view: `<svg class="btn-icon-small" viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`,
    edit: `<svg class="btn-icon-small" viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>`,
    delete: `<svg class="btn-icon-small" viewBox="0 0 24 24" style="width:16px;height:16px;fill:currentColor;"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>`
};

// --- 1. ระบบ Login & Auth ---
function checkLogin() {
    const user = document.getElementById("username").value;
    const pass = document.getElementById("password").value;
    if(user === "admin" && pass === "1234") {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "/dashboard";
    } else {
        alert("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง");
    }
}

function logout() {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
}

function authGuard() {
    if(!localStorage.getItem("isLoggedIn")) {
        window.location.href = "/login";
    }
}

// --- 2. ระบบบันทึกข้อมูล (Save) ---
function savePatient(event) {
    event.preventDefault();

    const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : ""; 
    };

    const getRadio = (name) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "-";
    };

    try {
        const newPatient = {
            // *** เพิ่มการบันทึกวันที่ปัจจุบันลงไป ***
            

            id: getValue("p_id"),
            title: getValue("p_title"),
            name: getValue("p_name"),
            surname: getValue("p_surname"),
            phone: getValue("p_phone"),
            dob: getValue("p_dob"),
            blood: getValue("p_blood"),

            addr_home: getValue("p_address_home"),
            prov_home: getValue("p_province_home"),
            dist_home: getValue("p_district_home"),
            subdist_home: getValue("p_subdistrict_home"),

            
            job: getValue("p_job"),
            race: getValue("p_race"),
            nat: getValue("p_nat"),
            rel: getValue("p_rel"),

            father: getValue("p_father"),
            mother: getValue("p_mother"),
            spouse: getValue("p_spouse"),

            em_name: getValue("p_em_name"),
            em_phone: getValue("p_em_phone"),
            em_addr: getValue("p_em_addr"),
            
            rights: getRadio("rights"),
            i_id: getRadio("i_id"),

            apm: getValue("amp"),
            a_id: getValue("a_id"),

            AD: getValue("AD"),
            DR: getValue("DR"),
            DS: getValue("DS"),
            
        };

        let patients = JSON.parse(localStorage.getItem("patients")) || [];
        patients.push(newPatient);
        localStorage.setItem("patients", JSON.stringify(patients));

        alert("บันทึกข้อมูลเรียบร้อย!");
        window.location.href = "/patient-list";

    } catch (error) {
        console.error("Save Error:", error);
        alert("เกิดข้อผิดพลาดในการบันทึก: " + error.message);
    }
}

// --- 3. ระบบแสดงผล (Load Table & Dashboard) ---
function loadPatients() {
    fetch("/api/patients")
        .then(res => res.json())
        .then(patients => {
            const tableBody = document.getElementById("patientTableBody");
            tableBody.innerHTML = "";

            patients.forEach((p, index) => {
                tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${p.hn}</td>
                    <td>${p.id_card}</td>
                    <td>${p.title}${p.name} ${p.surname}</td>
                    <td>${p.phone}</td>
                    <td>
                        <button class="btn-view" onclick="viewPatient(${p.patient_id})">
                            ${svgIcons.view} ดู
                        </button>
                        <button class="btn-edit" onclick="openEditModal(${p.patient_id})">
                            ${svgIcons.edit} แก้ไข
                        </button>
                        <button class="btn-del" onclick="deletePatient(${p.patient_id})">
                            ${svgIcons.delete} ลบ
                        </button>
                    </td>
                </tr>`;
            });
        });
}

// ดูรายละเอียด (View)
function viewPatient(index) {
    let patients = JSON.parse(localStorage.getItem("patients")) || [];
    let p = patients[index];

    const setVal = (id, val) => {
        const el = document.getElementById(id);
        if(el) el.innerText = val || "-";
    };

    setVal("v_fullname", `${p.title}${p.name} ${p.surname}`);
    setVal("v_id", p.id);
    setVal("v_dob", `${p.dob} (อายุ ${p.age} ปี)`);
    setVal("v_phone", p.phone);
    
    setVal("v_addr_home", `${p.addr_home} ต.${p.subdist_home} อ.${p.dist_home} จ.${p.prov_home}`);
    setVal("v_addr_curr", `${p.addr_curr} ต.${p.subdist_curr || '-'} อ.${p.dist_curr || '-'} จ.${p.prov_curr}`);
    
    setVal("v_status", p.status);
    setVal("v_job", p.job);
    setVal("v_demo", `เชื้อชาติ: ${p.race} / สัญชาติ: ${p.nat} / ศาสนา: ${p.rel}`);
    
    setVal("v_parents", `บิดา: ${p.father} / มารดา: ${p.mother}`);
    setVal("v_spouse", p.spouse);
    
    setVal("v_emergency", `${p.em_name} (ที่อยู่: ${p.em_addr}) โทร: ${p.em_phone}`);
    
    setVal("v_rights", p.rights);
    setVal("v_card_info", `เลขบัตร: ${p.card_no} (${p.card_type})`);
    setVal("v_hosp", `1. ${p.hosp_main} / 2. ${p.hosp_sub}`);

    document.getElementById("viewModal").style.display = "block";
}

function closeViewModal() {
    document.getElementById("viewModal").style.display = "none";
}
function saveEditPatient() {
    const i = document.getElementById("e_index").value, pts = JSON.parse(localStorage.getItem("patients"));
    const get = (id) => document.getElementById(id).value;
    pts[i].title=get("e_title"); pts[i].name=get("e_name"); pts[i].surname=get("e_surname");
    pts[i].phone=get("e_phone"); pts[i].rights=get("e_rights"); pts[i].prov_home=get("e_prov");
    localStorage.setItem("patients", JSON.stringify(pts));
    alert("แก้ไขสำเร็จ"); closeViewModal('editModal'); loadPatients();
}
function openEditModal(i) {
    const p = JSON.parse(localStorage.getItem("patients"))[i];
    const set = (id,v) => document.getElementById(id).value=v;
    set("e_index", i); set("e_title", p.title); set("e_name", p.name); set("e_surname", p.surname);
    set("e_phone", p.phone); set("e_rights", p.rights); set("e_prov", p.prov_home);
    document.getElementById("editModal").style.display="block";
}
function deletePatient(index) {
    if(confirm("ยืนยันการลบ?")) {
        let patients = JSON.parse(localStorage.getItem("patients")) || [];
        patients.splice(index, 1);
        localStorage.setItem("patients", JSON.stringify(patients));
        loadPatients();
    }
}

// --- 4. ฟังก์ชันสำหรับหน้าเว็บประชาชน (public-form.html) ---
function savePatientByUser(event) {
    event.preventDefault();

    const getValue = (id) => {
        const el = document.getElementById(id);
        return el ? el.value : ""; 
    };

    const getRadio = (name) => {
        const checked = document.querySelector(`input[name="${name}"]:checked`);
        return checked ? checked.value : "-";
    };

    try {
        const newPatient = {
            // *** เพิ่มการบันทึกวันที่ปัจจุบันลงไป ***
            

                        id: getValue("p_id"),
            title: getValue("p_title"),
            name: getValue("p_name"),
            surname: getValue("p_surname"),
            phone: getValue("p_phone"),
            dob: getValue("p_dob"),
            blood: getValue("p_blood"),

            addr_home: getValue("p_address_home"),
            prov_home: getValue("p_province_home"),
            dist_home: getValue("p_district_home"),
            subdist_home: getValue("p_subdistrict_home"),

            
            job: getValue("p_job"),
            race: getValue("p_race"),
            nat: getValue("p_nat"),
            rel: getValue("p_rel"),

            father: getValue("p_father"),
            mother: getValue("p_mother"),
            spouse: getValue("p_spouse"),

            em_name: getValue("p_em_name"),
            em_phone: getValue("p_em_phone"),
            em_addr: getValue("p_em_addr"),
            
            rights: getRadio("rights"),
            i_id: getRadio("i_id"),

            apm: getValue("amp"),
            a_id: getValue("a_id"),

            AD: getValue("AD"),
            DR: getValue("DR"),
            DS: getValue("DS"),
            
        };

        let patients = JSON.parse(localStorage.getItem("patients")) || [];
        patients.push(newPatient);
        localStorage.setItem("patients", JSON.stringify(patients));

        alert("บันทึกข้อมูลเรียบร้อย!");
        window.location.href = "/patient-list";

    } catch (error) {
        console.error("Save Error:", error);
        alert("เกิดข้อผิดพลาดในการบันทึก: " + error.message);
    }
}

// --- ระบบค้นหา (Search System) ---
function searchPatient() {
    const input = document.getElementById("searchInput").value.toLowerCase();
    const tableBody = document.getElementById("patientTableBody");
    const patients = JSON.parse(localStorage.getItem("patients")) || [];

    tableBody.innerHTML = "";

    const filtered = patients.filter(p => {
        const fullName = `${p.title}${p.name} ${p.surname}`.toLowerCase();
        const id = p.id.toLowerCase();
        return fullName.includes(input) || id.includes(input);
    });

    if (filtered.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 20px; color: #999;">❌ ไม่พบข้อมูลที่ค้นหา</td></tr>`;
        return;
    }

    filtered.forEach(p => {
        const originalIndex = patients.findIndex(original => original.id === p.id);

        let row = `<tr>
            <td>${p.id}</td>
            <td>${p.title}${p.name} ${p.surname}</td>
            <td>${p.prov_home}</td>
            <td>${p.phone}</td>
            <td><span class="badge-rights">${p.rights}</span></td>
            <td>
                <button class="btn-view" onclick="viewPatient(${originalIndex})">
                    ${svgIcons.view} ดู
                </button> 
                <button class="btn-edit" onclick="openEditModal(${originalIndex})">
                ${svgIcons.edit} แก้ไข
                </button>
                <button class="btn-del" onclick="deletePatient(${originalIndex})">
                    ${svgIcons.delete} ลบ
                </button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function closeViewModal(id) { document.getElementById(id).style.display="none"; }

function addAllergyRow() {
    const container = document.getElementById("allergy-container");
    const template = document.getElementById("allergy-template");

    const clone = template.cloneNode(true);
    clone.removeAttribute("id");

    // ล้างค่าเก่า
    clone.querySelectorAll("input, select").forEach(el => el.value = "");

    container.appendChild(clone);
}