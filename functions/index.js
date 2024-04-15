const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: 'fiddux-5a1f1',
        clientEmail: 'firebase-adminsdk-p824v@fiddux-5a1f1.iam.gserviceaccount.com',
        privateKey: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC8Ct2cDtHegBG+\nxi0Tfaf5t8D81IA16BbVBXmEglPx+gNtvBEmtK5zvjK60XvvqGxRdNjc1/rADaIq\n7S5GBBMpCrZ3QhhZfZgxSbXnwSqS/ux9F+nbu31QTUl3BmqJ2JLQ90hgRiD/xnK6\nepc548gYCsmpqIExdTtREDHVBIg1WIjGpIpB5DIHAL9yvczn0THNvper2NiXb6Ym\n1IgK45ak648z01J0ib113A/v96C7rUDC4W+qYa4jehajupF0E7OMBtJV/1hufc77\njXfj07Bmib9WMOM7DT+zp/w1xR3QKHvlqUats8dSilODfNwJIqkeaJ39VUdYc/Cv\n1JawkZrHAgMBAAECggEACexxrFYX4avukJvSx/ZX3ztBHKN2R+IBenWsgQxQgJk9\nUkg17rRjh6/GhTEGK/kLP/Ojq88pTraP4Ix3Zn7s9Lu5zDdmI5FLCKbalupAMSIk\n7UEa0ihl2s88jK+ymNqGFpZGPbzVtv0MRvN7RM6hjt50eaPVe/yACEbx6ktjImiv\nYUdWUn30UU/qCLDE0vMYAMXZNdTsOmbjm16YA4qEwVVdcsFDjFnikKXRrWlx9D6N\nAdTCpRnj7iEVIby1NiXg8lPpWd+x8wHRy3j0TvHAGCZ0oijnGTcp3k8dmsT3y6IF\nrtA56prsr3+FZbCF59vYCM37QLSU+qBNq4Q4FN9ToQKBgQD3OWQkMkylSCLGMRPP\nnQdbqEfuZPAujXe5+TCu2aWDCqpkwnP25GIoq3e/IdFkf/av+5hJofUDo2ndLr94\nBlh51f0EANc9VVeTqKfOe0wnIHhpbYJ0oKxqE4gR3/fRyTbmWJXd2GKz29OshMlC\nvFZjDS1lo14JJ3E0kEKGegV48QKBgQDCt6uTxcKoSlC8WpQSTfowVxiwUU5U2W7t\nvj4HqnmM9ZHNguRJfJizy2KHqlhRktM089ytKAUzZzjL+3gmWR4yIZFjFMHa6q7T\nO3tBG+5M7Szi7Xe6Z2eUKIMbPX8P6MmL5X133xlRlAoBOPmIIQrAzQ8o/luqMs+F\nlclAaDaPNwKBgBiWdqU683CEyiCYBPZjEbZF+FF3bIPUwhGW/QaG0vVDfErlJA9s\nC28sDo7N2Dt8lpZOGYlJOEsSV5cN7TEMwIPtimp5gu6wrDMdVQMuNBa4HgGuSIk8\n6ajrJF9SvRz6PCGQsecMfFSTCmxgEHw4qwbS6q7vHo0ehR3LMzKYtC6hAoGAGexD\n7m90o90I9JqGfg1dkpP12Htql0c/Sm16aqDaf9atq5OSeuoYlk8sde1KxslqTvFs\nXq0mTBqg6B85drmEmJ35chxwVonJ7ptLpHZoeltVD30X5HwhwQrHsZe1U9PlCTfr\nRUsxXrf7wP/p0KK9gL+MFiQO5hDPqfQwD+AP628CgYABkSW+ODNf9BDFfVO7RZNL\nRBFFQGDwSX3EseMPzwXygccSH/hEKd2RfENtk7PFW3mM4qOJVTXhzJl9u906P6D4\nB54kf8Fhuiqk7s7MjjK4RV9nNHy1qbzqD0GxmXhGETk61CDcvvaEiQH52vladZ2R\nuCKrPy1ETXreAcjV0i9FYw==\n-----END PRIVATE KEY-----\n'
    }),
    databaseURL: 'https://fiddux-5a1f1.firebaseio.com',
});
const db = admin.firestore();

var jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

var $ = jQuery = require('jquery')(window);

exports.sendWelcomeEmail = functions.auth.user().onCreate(async function (user) {

    const email = user.email;

    // var sendingEmail = email;
    // var title = "Welcome";
    // var body = `Thank you for registering for a new account.`;

    // await sendMail(sendingEmail, title, body);

    //Send admin email

    await db.collection("users").where('role', '==', 0).get().then(function (querySnapshot) {
        if (querySnapshot.size > 0) {
            var s = querySnapshot.docs.map(doc => {
                return doc.data();
            });

            s.forEach((d) => {
                var sendingEmail = d.email;
                var title = `ADMIN - New account request.`;
                var body = `<h4>Hi Team,</h4>
                <p>A new account was requested by ${email}.</p>
                <p>Please follow up.</p>`;

                sendMail(sendingEmail, title, body);
            })
        }
    });
});

exports.clientVerifiedEmail = functions.pubsub.schedule('*/1 * * * *').onRun(async function () {
        await db.collection("users").where('role', '==', 1).get().then(function (querySnapshot) {
            if (querySnapshot.size > 0) {

                var s = querySnapshot.docs.map(doc => {
                    return doc.data();
                });

                s.forEach((d) => {

                    if (d.email != "") {
                        if (!d.email_confirmed) {

                            admin.auth().getUser(d.doc_id)
                                .then((userRecord) => {

                                    // Check if the email is verified
                                    if (userRecord.emailVerified) {
                                        var sendingEmail = d.email;
                                        var title = `Account under processing and verification.`;
                                        var body = `<h4>Dear ${d.full_name},</h4>
                                        <p>Thank you for verifying your email.<br>
                                        Our team will review and process your application within one to three business days.</p>
                                        <p>Best regards,</p>
                                        <h4>FIDDUX TEAM</h4>`;

                                        sendMail(sendingEmail, title, body);

                                        //Update email confirmed
                                        var docRef = db.collection("users").doc(d.doc_id);
                                        docRef.update({
                                            email_confirmed: true
                                        })

                                        db.collection("users").where('role', '==', 0).get().then(function (snapshot) {
                                            if (snapshot.size > 0) {
                                                var a = snapshot.docs.map(doc => {
                                                    return doc.data();
                                                });

                                                a.forEach((b) => {

                                                    var sendingEmail = b.email;
                                                    var title = `ADMIN - New account verified by user.`;
                                                    var body = `<h4>Hi Team,</h4>
                                                    <p>A new account ${d.email} has been verified via email. A new client awaits the documents to be reviewed and an account to be approved.</p>
                                                    <p>Please follow up.</p>`;


                                                    sendMail(sendingEmail, title, body);
                                                })
                                            }
                                        });
                                    }
                                })
                                .catch((error) => {
                                    console.error('Error fetching user data:', error);
                                });
                        }
                    }
                })
            }
        })
    });


exports.clientEmailVerificationReminder = functions.pubsub.schedule('59 23 * * *').onRun(async function (user) {

    await db.collection("users").where('role', '==', 1).get().then(async function (querySnapshot) {
        if (querySnapshot.size > 0) {

            var s = querySnapshot.docs.map(doc => {
                return doc.data();
            });

            s.forEach(async (d) => {

                await admin.auth().getUser(d.doc_id)
                    .then(async function (userRecord) {

                        var diff = Math.abs(new Date() - new Date((d.registered_date.seconds) * 1000));
                        var minutes = Math.floor((diff / 1000) / 60);

                        if (minutes > 1440 && userRecord.emailVerified == false) {

                            var sendingEmail = userRecord.email;
                            var title = `Reminder: Account waiting for email verification.`;
                            var body = `<h4>Dear ${d.full_name},</h4>
                            <p>This is a reminder.<br>
                            In order to get your account verified and ready for use, please click on the link send on mail:<br>
                            Our onboarding team will be happy to assist you in the process.</p>
                            <p>Best regards,</p>
                            <h4>FIDDUX TEAM</h4>`;

                            await sendMail(sendingEmail, title, body);


                            //Send admin email

                            // var delayInMilliseconds = 10000; //10 second
                            // await setTimeout(async function () {
                            await db.collection("users").where('role', '==', 0).get().then(function (querySnapshot) {
                                if (querySnapshot.size > 0) {
                                    var s = querySnapshot.docs.map(doc => {
                                        return doc.data();
                                    });

                                    s.forEach((d) => {

                                        var sendingEmail = d.email;
                                        var title = `ADMIN - REMINDER missing verification.`;
                                        var body = `<h4>Hi Team,</h4>
                                            <p>Client ${userRecord.email} missing email verification.</p>
                                            <p>Please follow up.</p>`;

                                        sendMail(sendingEmail, title, body);
                                    })
                                }
                            });

                            //}, delayInMilliseconds);
                        }

                    })
                    .catch((error) => {
                        console.log('Error fetching user data:', error);
                    });
            })
        }
    })


});

exports.newTransaction = functions.firestore.document("transection_requests/{documentId}")
    .onCreate(async function (snapshot, context) {
        const commentdata = snapshot.data();
        let doc_id = commentdata.doc_id;

        await db.collection("transection_requests").doc(doc_id).get()
            .then(async function (doc) {
                if (doc.exists) {

                    var data = doc.data();

                    await db.collection("users").doc(data.user_id).get().then(async function (snapshot) {
                        if (snapshot.exists) {

                            var data1 = snapshot.data();

                            var sendingEmail = ``;
                            var title = ``;
                            var body = ``;


                            if (commentdata.request_type == 0) {

                                sendingEmail = data1.email;
                                title = `New deposit request`;
                                body = `<h4>Dear ${data1.full_name},</h4>
                                <p>Thank you for requesting a new deposit.<br>
                                Our team will process and send an update in the next few hours.</p>
                                <p>Best regards,</p>
                                <h4>FIDDUX TEAM</h4>`;

                                await sendMail(sendingEmail, title, body);

                                //Send admin email
                                // var delayInMilliseconds = 10000; //10 second
                                // await setTimeout(async function () {
                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                    if (querySnapshot.size > 0) {
                                        var s = querySnapshot.docs.map(doc => {
                                            return doc.data();
                                        });

                                        s.forEach((d) => {

                                            sendingEmail = d.email;
                                            title = `ADMIN - New deposit request`;
                                            body = `<h4>Hi Team,</h4>
                                            <p>A new deposit was requested by ${data1.email}, and it needs to be approved.</p>
                                            <p>Please follow up.</p>`;

                                            sendMail(sendingEmail, title, body);
                                        })
                                    }
                                });
                                //}, delayInMilliseconds);

                            }

                            else if (commentdata.request_type == 1) {

                                await db.collection("app_setting").doc("settings").get()
                                    .then(async function (doc) {
                                        if (doc.exists) {

                                            var dataVal = doc.data();
                                            var verification = dataVal.verification;

                                            if (verification) {

                                                // sendingEmail = data1.email;
                                                // title = `PLEASE CONFIRM WITHDRAWN REQUEST`;
                                                // body = `<h4>Dear ${data1.full_name},</h4>
                                                // <p>You have requested a new withdraw.<br>
                                                // Please confirm your request by usind the OTP code below.<br>
                                                // ${data.otp}
                                                // <br>
                                                // If you did not make this request, please contact support as soon as possible.</p>
                                                // <p>Best regards,</p>
                                                // <h4>FIDDUX TEAM</h4>`;

                                                // await sendMail(sendingEmail, title, body);

                                                //Send admin email
                                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                                    if (querySnapshot.size > 0) {
                                                        var s = querySnapshot.docs.map(doc => {
                                                            return doc.data();
                                                        });

                                                        s.forEach((d) => {

                                                            sendingEmail = d.email;
                                                            title = `ADMIN - New withdrawal request`;
                                                            body = `<h4>Hi Team,</h4>
                                                                <p>A new deposit was requested by ${data1.email}.<br>
                                                                Waiting for client to insert OTP to confirm.</p>
                                                                <p>Please follow up.</p>`;

                                                            sendMail(sendingEmail, title, body);
                                                        })
                                                    }
                                                });
                                            }
                                            else {

                                                sendingEmail = data1.email;
                                                title = `New withdrawal request`;
                                                body = `<h4>Dear ${data1.full_name},</h4>
                                                <p>You have requested a new withdraw.<br>
                                                If you did not make this request, please contact support as soon as possible.</p>
                                                <p>Best regards,</p>
                                                <h4>FIDDUX TEAM</h4>`;

                                                await sendMail(sendingEmail, title, body);

                                                //Send admin email

                                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                                    if (querySnapshot.size > 0) {
                                                        var s = querySnapshot.docs.map(doc => {
                                                            return doc.data();
                                                        });

                                                        s.forEach((d) => {

                                                            sendingEmail = d.email;
                                                            title = `ADMIN - New withdrawal request`;
                                                            body = `<h4>Hi Team,</h4>
                                                                <p>A new deposit was requested by ${data1.email}.</p>
                                                                <p>Please follow up.</p>`;

                                                            sendMail(sendingEmail, title, body);
                                                        })
                                                    }
                                                });
                                            }

                                        }
                                    }).catch(function (error) {
                                        console.log("Error ", error);
                                    })
                            }
                        }
                    })

                }
            }).catch(function (error) {
                console.log("Error ", error);
            })
    });

exports.transactionStatusUpdate = functions.firestore.document("transection_requests/{documentId}")
    .onUpdate(async function (snapshot, context) {

        const newValue = snapshot.after.data();
        const previousValue = snapshot.before.data();

        const commentdata = snapshot.before.data();
        let doc_id = commentdata.doc_id;

        await db.collection("transection_requests").doc(doc_id).get()
            .then(async function (doc) {
                if (doc.exists) {
                    var data = doc.data();
                    //Get User Detail
                    await db.collection("users").doc(data.user_id).get().then(async function (snapshot) {
                        if (snapshot.exists) {

                            var data1 = snapshot.data();

                            var sendingEmail = ``;
                            var title = ``;
                            var body = ``;

                            if (data.request_type == 0 && previousValue.request_status == 0 && newValue.request_status == 3) {

                                sendingEmail = data1.email;
                                title = `Deposit cancelation`;
                                body = `<h4>Dear ${data1.full_name},</h4>
                                <p>You have cancelled your deposit request.<br>
                                Your account will be updated accordingly.</p>
                                <p>Best regards,</p>
                                <h4>FIDDUX TEAM</h4>`;

                                await sendMail(sendingEmail, title, body);

                                //Send admin email

                                // var delayInMilliseconds = 10000; //10 second
                                // await setTimeout(async function () {
                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                    if (querySnapshot.size > 0) {
                                        var s = querySnapshot.docs.map(doc => {
                                            return doc.data();
                                        });

                                        s.forEach((d) => {

                                            sendingEmail = d.email;
                                            title = `ADMIN - Deposit cancelation request`;
                                            body = `<h4>Hi Team,</h4>
                                                <p>The user ${data1.email} cancelled the deposit request.</p>
                                                <p>Please follow up.</p>`;

                                            sendMail(sendingEmail, title, body);
                                        })
                                    }
                                });
                                // }, delayInMilliseconds);


                            }
                            else if (data.request_type == 1 && previousValue.request_status == 1 && newValue.request_status == 2) {

                                sendingEmail = data1.email;
                                title = `Terms of withdrawal accepted`;
                                body = `<h4>Dear ${data1.full_name},</h4>
                                <p>Thank you for confirming your withdrawal terms.<br>Our team will process your request and complete your withdrawal within the next 48 hours.</p>
                                <p>Best regards,</p>
                                <h4>FIDDUX TEAM</h4>`;

                                await sendMail(sendingEmail, title, body);

                                //Send admin email

                                // var delayInMilliseconds = 10000; //10 second

                                // await setTimeout(async function () {
                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                    if (querySnapshot.size > 0) {
                                        var s = querySnapshot.docs.map(doc => {
                                            return doc.data();
                                        });

                                        s.forEach((d) => {

                                            sendingEmail = d.email;
                                            title = `ADMIN - Withdrawal Terms Agreed`;
                                            body = `<h4>Hi Team,</h4>
                                                <p>The client ${data1.email} agreed with the withdrawal. Please check the payment is been processed with senior management.</p>`;

                                            sendMail(sendingEmail, title, body);
                                        })
                                    }
                                });
                                //}, delayInMilliseconds);


                            }
                            else if (data.request_type == 1 && previousValue.request_status == 0 && newValue.request_status == 3) {

                                sendingEmail = data1.email;
                                title = `Withdrawal Cancelled`;
                                body = `<h4>Dear ${data1.full_name},</h4>
                                <p>This is a courtesy email to inform you that your withdrawn has been cancelled as per your request.
                                </p>
                                <p>Best regards,</p>
                                <h4>FIDDUX TEAM</h4>`;

                                await sendMail(sendingEmail, title, body);

                                //Send admin email

                                // var delayInMilliseconds = 10000; //10 second

                                // await setTimeout(async function () {
                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                    if (querySnapshot.size > 0) {
                                        var s = querySnapshot.docs.map(doc => {
                                            return doc.data();
                                        });

                                        s.forEach((d) => {

                                            sendingEmail = d.email;
                                            title = `ADMIN - Withdrawal Cancelled`;
                                            body = `<h4>Hi Team,</h4>
                                                <p>The client ${data1.email} did not accpet the terms and the withdrawn was cancelled.</p>
                                                <p>Please inform senior managment.</p>`;

                                            sendMail(sendingEmail, title, body);
                                        })
                                    }
                                });
                                //}, delayInMilliseconds);

                            }
                            else if (data.request_type == 1 && previousValue.otp_verify == false && newValue.otp_verify == true) {

                                await db.collection("app_setting").doc("settings").get()
                                    .then(async function (doc) {
                                        if (doc.exists) {

                                            var data2 = doc.data();
                                            var verification = data2.verification;

                                            if (verification) {

                                                sendingEmail = data1.email;
                                                title = `Withdrawal processing`;
                                                body = `<h4>Dear ${data1.full_name},</h4>
                                                <p>Thank you for verifying your withdrawn request.<br>
                                                Our team will process your request, and respond within 24 hours.<br>
                                                Please note that you will receive a notification once it's been processed.<br>
                                                In situations of extremely volatile markets and in particular withdrawn condictions contemplating the full some, you will receive an in-app notification with the current balance of the account, and you will have 1 hour to accept the terms.
                                                </p>
                                                <p>Best regards,</p>
                                                <h4>FIDDUX TEAM</h4>`;

                                                await sendMail(sendingEmail, title, body);

                                                //Send admin email

                                                // var delayInMilliseconds = 10000; //10 second

                                                // await setTimeout(async function () {
                                                await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                                    if (querySnapshot.size > 0) {
                                                        var s = querySnapshot.docs.map(doc => {
                                                            return doc.data();
                                                        });

                                                        s.forEach((d) => {

                                                            sendingEmail = d.email;
                                                            title = `ADMIN - Withdrawal Confirmed`;
                                                            body = `<h4>Hi Team,</h4>
                                                                <p>Please process the withdrawal requested and confirmed by ${data1.email}.</p>
                                                                <p>Please follow up.</p>`;

                                                            sendMail(sendingEmail, title, body);
                                                        })
                                                    }
                                                });
                                                //}, delayInMilliseconds);

                                            }
                                        }
                                    }).catch(function (error) {
                                        console.log("Error ", error);
                                    })
                            }
                        }
                    })
                }
            })
    });

exports.newMonthlyClosing = functions.firestore.document("monthly_closings/{documentId}")
    .onCreate(async function (snapshot, context) {

        const commentdata = snapshot.data();
        let doc_id = commentdata.doc_id;

        await db.collection("monthly_closings").where('doc_id', '==', doc_id).where('is_email_notified', '==', true).get().then(async function (snapshot) {
            if (snapshot.size > 0) {

                var s = snapshot.docs.map(doc => {
                    return doc.data();
                });

                s.forEach((d) => {

                    db.collection("users").doc(d.user_id).get().then(async function (snapshot) {
                        if (snapshot.exists) {

                            var data1 = snapshot.data();

                            var sendingEmail = data1.email;
                            var title = `Monthly report notificaiton`;
                            var body = `<h4>Dear ${data1.full_name},</h4>
                            <p>Your monthly performance has been processed.<br>
                            Please login to the app to view you update balance.</p>
                            <p>Best regards,</p>
                            <h4>FIDDUX TEAM</h4>`;

                            await sendMail(sendingEmail, title, body);

                            // var delayInMilliseconds = 10000; //10 second

                            // await setTimeout(async function () {
                            await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
                                if (querySnapshot.size > 0) {
                                    var s = querySnapshot.docs.map(doc => {
                                        return doc.data();
                                    });

                                    s.forEach((d) => {

                                        sendingEmail = d.email;
                                        title = `Monthly report notificaiton`;
                                        body = `<h4>Hi Team,</h4>
                                            <p>A monthly report reminder was sent to client: ${data1.email}.</p>
                                            <p>Best regards,</p>`;

                                        sendMail(sendingEmail, title, body);
                                    })
                                }
                            });
                            // }, delayInMilliseconds);

                        }
                    })
                })
            }
        })
    });


// exports.testingConcurrentMail = functions.firestore.document("yearly_graph/{documentId}")
//     .onUpdate(async function (snapshot, context) {

//         await db.collection("users").where('role', '==', 0).get().then(async function (querySnapshot) {
//             if (querySnapshot.size > 0) {
//                 var s = querySnapshot.docs.map(doc => {
//                     return doc.data();
//                 });

//                 s.forEach((d) => {

//                     sendingEmail = d.email;
//                     title = `Testing Email`;
//                     body = `Sample testing email`;

//                     sendMail(sendingEmail, title, body);
//                 })
//             }
//         });

//     });

function sendMail(email, title, body) {

    $.ajax({
        url: 'http://admin.fidusfinance.com/customMail?sendEmail=' + email + '&title=' + title + '&body=' + body,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: "{}",
        dataType: "json",
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.log(error);
            return error;
        },
    });
}