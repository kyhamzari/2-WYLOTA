async function handleProofSubmit() {
    const fileInput = document.getElementById('receiptUpload');
    const btn = document.getElementById('btnSubmitProof');

    if (fileInput.files.length === 0) {
        alert("Please select a file first.");
        return;
    }

    // Prepare the button state
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Sending to Admin...';

    const file = fileInput.files[0];
    
    // We convert the file to Base64 so EmailJS can send it
    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    try {
        const base64File = await toBase64(file);

        const templateParams = {
            from_name: "Wazobia Youth Donor",
            message: "A new bank transfer receipt has been uploaded.",
            my_file: base64File // This attaches the image/PDF
        };

        await emailjs.send('YOUR_SERVICE_ID', 'template_bh6j7ug', templateParams);

        alert("Success! Your receipt has been sent to our team.");
        
        // Close modal
        bootstrap.Modal.getInstance(document.getElementById('successModal')).hide();
        fileInput.value = ''; 

    } catch (error) {
        console.error("Email Error:", error);
        alert("Upload failed. Please check your internet or try again.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Submit Proof of Payment';
    }
}
