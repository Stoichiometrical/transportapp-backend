import { Trip } from "../models/Trip.js";
import nodemailer from "nodemailer"
import dotenv from "dotenv"

dotenv.config()



// Create one trip
export const createTrip = async (req, res) => {
    try {
        const trip = await Trip.create(req.body);
        res.status(201).json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating trip' });
    }
};

// Create many trips
export const createManyTrips = async (req, res) => {
    try {
        const trips = await Trip.insertMany(req.body);
        res.status(201).json(trips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error creating trips' });
    }
};

// Delete trip
export const deleteTrip = async (req, res) => {
    const { id } = req.params;

    try {
        const trip = await Trip.findByIdAndDelete(id);

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error deleting trip' });
    }
};

// Update trip
export const updateTrip = async (req, res) => {
    const { id } = req.params;

    try {
        const trip = await Trip.findByIdAndUpdate(id, req.body, { new: true });

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json(trip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating trip' });
    }
};

// Get all trips
export const getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find();

        // Format the date in the desired format (DD-MM-YYYY)
        const formattedTrips = trips.map((trip) => ({
            ...trip._doc,
            date: trip.date.toLocaleDateString('en-GB'), // Assumes date is a JavaScript Date object
        }));

        res.json(formattedTrips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting trips' });
    }
};


// Get trip by ID
export const getTripById = async (req, res) => {
    const { id } = req.params;

    try {
        const trip = await Trip.findById(id);

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Format date as "DD-MM-YYYY"
        const formattedDate = trip.date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        });

        // Replace the original date with the formatted one
        const formattedTrip = { ...trip._doc, date: formattedDate };

        res.json(formattedTrip);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting trip' });
    }
};


// Get trips by organizer ID
export const getTripsByOrganizerId = async (req, res) => {
    const { organizerId } = req.params;

    try {
        const trips = await Trip.find({ organizer: organizerId });

        // Format date in the trips array
        const formattedTrips = trips.map((trip) => ({
            ...trip.toObject(),
            date: trip.date.toLocaleDateString('en-GB'), // Adjust the locale based on your requirement
        }));

        res.json(formattedTrips);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error getting trips' });
    }
};



// UpdateApprovalStatus
// export const updateApprovalStatus = async (req, res) => {
//     const { tripId } = req.params;
//     const { approvalStatus } = req.body;
//
//     try {
//         const trip = await Trip.findByIdAndUpdate(
//             tripId,
//             { approvalStatus },
//             { new: true }
//         );
//
//         if (!trip) {
//             return res.status(404).json({ error: 'Trip not found' });
//         }
//
//         res.json({ message: 'Approval status updated successfully', trip });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error updating Approval status' });
//     }
// };


// UpdateNitish status
export const updateNitishStatus = async (req, res) => {
    const { tripId } = req.params; // Use params to get tripId from the URL
    const { nitishStatus } = req.body;

    try {
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { nitishStatus },
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        res.json({ message: 'Nitish status updated successfully', trip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating Nitish status' });
    }
};


// Update Approval Status
export const updateApprovalStatus = async (req, res) => {
    const { tripId } = req.params;
    const { approvalStatus } = req.body;

    try {
        const trip = await Trip.findByIdAndUpdate(
            tripId,
            { $set: { approvalStatus } },
            { new: true }
        );

        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        // Send email if the approval status is "Approved"
        if (approvalStatus === 'Approved') {
            sendApprovalEmail(trip.organizerEmail, trip);
        }

        res.json({ message: 'Approval status updated successfully', trip });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error updating approval status' });
    }
};


// // Function to send approval email
// const sendApprovalEmail = (organizerEmail, tripDetails) => {
//     // Convert date to the desired format
//     const formattedDate = new Date(tripDetails.date).toLocaleDateString('en-US', {
//         weekday: 'short',
//         day: '2-digit',
//         month: 'long',
//         year: 'numeric',
//     });
//
//     // Configure nodemailer transporter
//     const transporter = nodemailer.createTransport({
//         service: 'gmail',
//         host: 'smtp.gmail.com',
//         auth: {
//             user: process.env.EMAIL_ADDRESS,
//             pass: process.env.EMAIL_PASSWORD,
//         },
//     });
//
//     const mailOptions = {
//         from: process.env.EMAIL_ADDRESS,
//         to: organizerEmail,
//         subject: 'ALC TRANSPORT REQUEST UPDATE',
//         // Use HTML formatting for the email body
//         html: `
//             <p>Hello,</p>
//             <p>I trust this email finds you well.</p>
//
//             <p>Your transport request has been received and accommodated. Please find below the schedule for your transportation for <b>${formattedDate}</b>:</p>
//
//             <p>
//                 <b>${tripDetails.pickupTime}: ${tripDetails.pickupLocation} - ${tripDetails.dropoffLocation}</b><br />
//                   <b>${tripDetails.isOneWay ? null : (
//                    {\`${tripDetails.returnTime} - ${tripDetails.dropoffLocation} - ${tripDetails.pickupLocation}\`}
//                 )}</b>
//                 <b>${tripDetails.returnTime}: ${tripDetails.dropoffLocation} - ${tripDetails.pickupLocation}</b>
//             </p>
//
//             <p>Your assigned driver can also be reached at <b>+230 5766 9349</b>. Should there be any changes, promptly reach out to our team.</p>
//
//             <p>Regards,</p>
//         `,
//     };
//
//     transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//             console.error('Error sending email:', error);
//         } else {
//             console.log('Email sent:', info.response);
//             alert('Email Sent');
//         }
//     });
// };
//


// Function to send approval email
const sendApprovalEmail = (organizerEmail, tripDetails) => {
    // Convert date to the desired format
    const formattedDate = new Date(tripDetails.date).toLocaleDateString('en-US', {
        weekday: 'short',
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    });

    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: organizerEmail,
        subject: 'ALC TRANSPORT REQUEST UPDATE',
        // Use HTML formatting for the email body
        html: `
            <p>Hello,</p>
            <p>I trust this email finds you well.</p>

            <p>Your transport request has been received and accommodated. Please find below the schedule for your transportation for <b>${formattedDate}</b>:</p>

            <p>
                <b>${tripDetails.pickupTime}: ${tripDetails.pickupLocation} - ${tripDetails.dropoffLocation}</b><br />
                ${tripDetails.isOneWay ? '' : `<b>${tripDetails.returnTime}: ${tripDetails.dropoffLocation} - ${tripDetails.pickupLocation}</b>`}
            </p>

            <p>Your assigned driver can also be reached at <b>+230 5766 9349</b>. Should there be any changes, promptly reach out to our team.</p>

            <p>Regards,</p>
        `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent:', info.response);
            alert('Email Sent');
        }
    });
};
