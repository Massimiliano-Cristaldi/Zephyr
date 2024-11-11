import { createConnection } from "mysql";
import express from "express";
import cors from "cors";
import multer from "multer";
import path from "path";
import fs from "fs";

import dotenv from "dotenv";
dotenv.config();
const env = process.env;

console.log("Connecting to backend...");

//Configuration
const app = express();
const db = createConnection(
    {
        host: env.hostname,
        user: env.user,
        password: env.password,
        database: env.dbname
    }
);
app.listen(8800, ()=>{
    console.log("Estabilished connection on port 8800");
})
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(`http://${env.hostname}:${env.port}/`));

const audioStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '../Client/public/audio_recordings')
    },
    filename: (req, file, cb)=>{
        const randId = (Math.round(Math.random() * 1000)).toString();
        cb(null, "audio_recording_" + randId + "_" + Date.now() + ".wav")
    }
});
const uploadAudio = multer({
    storage: audioStorage
})

const attachmentStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '../Client/public/attachments')
    },
    filename: (req, file, cb)=>{
        const randId = (Math.round(Math.random() * 1000)).toString();
        cb(null, "attachment_" + randId + "_" + Date.now() + path.extname(file.originalname))
    }
});
const uploadAttachment = multer({
    storage: attachmentStorage
})

const iconStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '../Client/public/user_icons')
    },
    filename: (req, file, cb)=>{
        const randId = (Math.round(Math.random() * 1000)).toString();
        cb(null, "user_icon_" + randId + "_" + Date.now() + path.extname(file.originalname))
    }
});
const uploadIcon = multer({
    storage: iconStorage
})

const groupIconStorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, '../Client/public/group_icons')
    },
    filename: (req, file, cb)=>{
        const randId = (Math.round(Math.random() * 1000)).toString();
        cb(null, "group_icon_" + randId + "_" + Date.now() + path.extname(file.originalname))
    }
});
const uploadGroupIcon = multer({
    storage: groupIconStorage
})

//API entry points
app.get("/userinfo/:id", (req, res)=>{
    const q = `SELECT DISTINCT users.*, users_added_by.user_added_as 
    FROM users LEFT JOIN users_added_by
    ON users.id = users_added_by.added_user_id
    WHERE users.id = ?`;
    const values = req.params.id;
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

//Dev feature, used to test different profiles
app.get("/getallusers", (req, res)=>{
    const q = `SELECT * FROM users`;
    db.query(q, (err, data)=>{
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/contactlist/:authId", (req, res)=>{
    const q = "SELECT * FROM users LEFT JOIN users_added_by ON users.id = users_added_by.added_user_id WHERE contact_list_owner_id = ? ORDER BY last_message DESC";
    const authId = req.params.authId;
    db.query(q, authId, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/contact/:authId/:contactId", (req, res)=>{
    const q = "SELECT * FROM users LEFT JOIN users_added_by ON users.id = users_added_by.added_user_id WHERE contact_list_owner_id = ? AND users.id = ?";
    const values = [req.params.authId, req.params.contactId];
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/groupchatlist/:authId", (req, res)=>{
    const q = `SELECT * FROM group_chats LEFT JOIN group_participants
    ON group_chats.id = group_participants.group_id
    WHERE group_participants.participant_id = ?
    ORDER BY last_message DESC`;
    const values = req.params.authId;
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/groupchat/:groupId", (req, res)=>{
    const q = `SELECT * FROM group_chats WHERE id = ?`;
    const values = req.params.groupId;
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/groupparticipants/:authId/:groupId", (req, res)=>{
    const q = `CALL get_group_participants(?, ?)`;
    const values = [req.params.authId, req.params.groupId];
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/messages/:authUserId/:contactId", (req, res)=>{
    const q = "CALL get_chat_messages(?, ?)"
    const params = [req.params.authUserId, req.params.contactId];
    db.query(q, params, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.get("/groupmessages/:authId/:groupId", (req, res)=>{
    const q = "CALL get_group_chat_messages(?, ?)";
    const values = [req.params.authId, req.params.groupId];
    db.query(q, values, (err, data)=>{
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post("/sendmessage", (req, res)=>{
    const q = `INSERT INTO messages (content, audio_content, attachments, sender_id, sender_username, recipient_id, replying_to_message_id) VALUES (?)`;
    const values = [req.body.content, 
        req.body.audio_content, 
        req.body.attachments, 
        req.body.sender_id, 
        req.body.sender_username, 
        req.body.recipient_id, 
        req.body.replying_to_message_id];
    db.query(q, [values], (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post("/sendgroupmessage", (req, res)=>{
    const q = `INSERT INTO group_messages (content, audio_content, attachments, sender_id, sender_username, group_id, replying_to_message_id) VALUES (?)`;
    const values = [req.body.content, 
        req.body.audio_content, 
        req.body.attachments, 
        req.body.sender_id, 
        req.body.sender_username, 
        req.body.group_id, 
        req.body.replying_to_message_id];
    db.query(q, [values], (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    });
})

app.post("/postaudio", uploadAudio.fields([{ name: 'audiofile', maxCount: 1 }, { name: 'filename', maxCount: 1 }]), (req, res)=>{
    const audioFile = req.files.audiofile[0];
    const audioFileName = `/audio_recordings/${audioFile.filename}`;
    const basePath = "../Client/public";
    fs.rename(basePath + audioFileName, basePath + req.body.filename, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Error saving file");
        }
        return res.send("Audio file posted successfully");
    });
})

app.post("/postattachment", uploadAttachment.fields([{name: 'attachment', maxCount: 1}, {name: 'filename', maxCount: 1}]), (req, res)=>{
    const attachment = req.files.attachment[0];
    const attachmentName = `/attachments/${attachment.filename}`;
    const basePath = "../Client/public";
    fs.rename(basePath + attachmentName, basePath + req.body.filename, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Error saving file");
        }
        return res.send("Attachment posted successfully");
    });
})

app.post("/deletemessage", (req, res)=>{
    const q = 'UPDATE messages SET content = "", audio_content = null, attachments = null, replying_to_message_id = null WHERE id = ?';
    const values = req.body.messageId;
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post("/deletegroupmessage", (req, res)=>{
    const q = 'UPDATE group_messages SET content = "", audio_content = null, attachments = null, replying_to_message_id = null WHERE id = ?';
    const values = req.body.messageId;
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post("/addcontact", (req, res)=>{
    const q1 = "SELECT id FROM users WHERE phone_number = ?";
    const values1 = req.body.phone_number;
    db.query(q1, values1, (err, data)=>{
        if (err) {
            return res.json(err);
        } else if (!data[0].id){
            return res.json("Could not find a contact with this phone number");
        }

        const q2 = `INSERT INTO users_added_by 
        (contact_list_owner_id, added_user_id, user_added_as)
        VALUES (?, ?, ?)`;
        const values2 = [req.body.contact_list_owner_id, data[0].id, req.body.user_added_as];
        db.query(q2, values2, (err, data)=>{
            if (err) {
                return res.json(err);
            }
        })
        return res.json(data[0].id);
    })
})

app.post("/addparticipants/:groupId", (req, res)=>{
    let q = "INSERT INTO group_participants (group_id, participant_id) VALUES";
    req.body.contactIds.forEach((contactId)=>
        q += ` (${req.params.groupId}, ${contactId}),`
);
q = q.slice(0, q.length - 1);
db.query(q, (err, data)=>{
    if (err) {
        return res.json(err);
    }
    return res.json(data);
})
})

app.post("/removeparticipant/:groupId/:userId", (req, res)=>{
    const q = "DELETE FROM group_participants WHERE group_id = ? AND participant_id = ?";
    const values = [req.params.groupId, req.params.userId];
    db.query(q, values, (err, data)=>{
        if (err){
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post("/updateicon", uploadIcon.fields([
    {name: "icon", maxCount: 1}, 
    {name: "filename", maxCount: 1}, 
    {name: "userid", maxCount: 1}]), 
    (req, res)=>{
        const icon = req.files.icon[0];
        const iconName = `/user_icons/${icon.filename}`;
        const basePath = "../Client/public";
        fs.rename(basePath + iconName, basePath + req.body.filename, (err) => {
            if (err) {
                console.error("Error renaming file:", err);
                return res.status(500).send("Error saving file");
            }
        });
        const q = "UPDATE users SET icon_url = ? WHERE id = ?";
        const values = [req.body.filename, req.body.userid];
        db.query(q, values, (err, data)=>{
            if (err) {
                return res.json(err);
            }
            return res.json(data);
        })
    }
)

app.post("/updateuserinfo", (req, res)=>{
    const q = `UPDATE users SET ${req.body.field} = ? WHERE id = ?`;
    const values = [req.body.value, req.body.authUserId];
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }        
        return res.json(data);
    });
})

app.post("/updatecontactinfo", (req, res)=>{
    const q = `UPDATE users_added_by SET user_added_as = ? WHERE contact_list_owner_id = ? AND added_user_id = ?`;
    const values = [req.body.value, req.body.authUserId, req.body.contactId];
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }        
        return res.json(data);
    });
})

app.post("/creategroup", uploadGroupIcon.fields([
    {name: "title", maxCount: 1}, 
    {name: "participants", maxCount: 1}, 
    {name: "icon", maxCount: 1}, 
    {name: "filename", maxCount: 1}]),
    (req, res)=>{
        const icon = req.files.icon[0];
        const iconName = `/group_icons/${icon.filename}`;
        const basePath = "../Client/public";
        fs.rename(basePath + iconName, basePath + req.body.filename, (err) => {
            if (err) {
                console.error("Error renaming file:", err);
                return res.status(500).send("Error saving file");
            }
        });

        const q1 = "INSERT INTO group_chats (title, icon_url) VALUES (?, ?)";
        const values1 = [req.body.title, req.body.filename];
        db.query(q1, values1, (err1, data1)=>{
            if (err1) {
                return res.json(err1);
            }
            let idList = `(${data1.insertId}, ${req.body.founder_id}, 1), `;
            req.body.participants.split(",").map((id)=>{
                idList += `(${data1.insertId}, ${id}, 0), `
            });
            idList = idList.substring(0, idList.length - 2);
            const q2 = `INSERT INTO group_participants VALUES ${idList}`;
            db.query(q2, (err2, data2)=>{
                if (err2) {
                    return res.json(err2);
                }
                return res.json(data1);
            })
        })
})

app.post("/updategrouptitle/:groupId", (req, res)=>{
    const q = "UPDATE group_chats SET title = ? WHERE id = ?";
    const values = [req.body.title, req.params.groupId];
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})

app.post("/updategroupicon/:groupId", uploadGroupIcon.fields([
    {name: "icon", maxCount: 1}, 
    {name: "filename", maxCount: 1}]), 
    (req, res)=>{
    const icon = req.files.icon[0];
    const tempName = `/group_icons/${icon.filename}`;
    const basePath = "../Client/public";
    fs.rename(basePath + tempName, basePath + req.body.filename, (err) => {
        if (err) {
            console.error("Error renaming file:", err);
            return res.status(500).send("Error saving file");
        }
    });

    const q = "UPDATE group_chats SET icon_url = ? WHERE id = ?";
    const values = [req.body.filename, req.params.groupId];
    db.query(q, values, (err, data)=>{
        if (err) {
            return res.json(err);
        }
        return res.json(data);
    })
})