document.getElementById('invitationType').addEventListener('change', function() {
    const nameInputs = document.getElementById('nameInputs');
    if (this.value === 'family') {
        nameInputs.innerHTML = '<input type="text" id="guestName1" placeholder="Մուտքագրեք առաջին անունը"><br>' +
                               '<input type="text" id="guestName2" placeholder="Մուտքագրեք երկրորդ անունը">';
    } else {
        nameInputs.innerHTML = '<input type="text" id="guestName1" placeholder="Մուտքագրեք Ձեր անունը">';
    }
});

function generateInvitation() {
    const invitationType = document.getElementById('invitationType').value;
    const backgroundUpload = document.getElementById('backgroundUpload').files[0];
    let guestName1 = document.getElementById('guestName1').value;
    let guestName2 = invitationType === 'family' ? document.getElementById('guestName2').value : '';
    const brideName = document.getElementById('brideName').value;
    const groomName = document.getElementById('groomName').value;
    const weddingDate = document.getElementById('weddingDate').value;
    const weddingTime = document.getElementById('weddingTime').value;
    const weddingPlace = document.getElementById('weddingPlace').value;
    const fontSelect = document.getElementById('fontSelect').value;

    if (!guestName1 || (invitationType === 'family' && !guestName2) || !backgroundUpload ||
        !brideName || !groomName || !weddingDate || !weddingTime || !weddingPlace) {
        alert('Պահանջվում են բոլոր դաշտերը:');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const image = new Image();
        image.onload = function() {
            const canvas = document.getElementById('invitationCanvas');
            const ctx = canvas.getContext('2d');
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

            let maxFontSize = canvas.width / 15;
            let minFontSize = 24;
            let fontSize = maxFontSize * 0.9 * 0.85;

            // Apply selected font
            ctx.font = `${fontSize}px ${fontSelect}`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.shadowColor = 'white';
            ctx.shadowBlur = 15;

            let textToShow = invitationType === 'family' ? 
                `Սիրելի\n ${guestName1} եւ ${guestName2},\nսիրով հրավիրում ենք Ձեզ\nընտանյոք հանդերձ մասնակցելու\nմեր սիրելի զավակներ\n${brideName} և ${groomName}\nպսակադրության ու\nՀարսանյաց հանդեսին,\nորը տեղի կունենա ${weddingDate}-ին\nժամը ${weddingTime}-ին ${weddingPlace}ում,\nՍիրով կսպասենք։` :
                `Սիրելի ${guestName1},\nսիրով հրավիրում ենք Ձեզ\nմասնակցելու\nմեր սիրելի զավակներ\n${brideName} և ${groomName}\nպսակադրության ու\nՀարսանյաց հանդեսին,\nորը տեղի կունենա ${weddingDate}-ին\nժամը ${weddingTime}-ին ${weddingPlace}ում,\nՍիրով կսպասենք։`;

            const lines = textToShow.split('\n');
            let y = canvas.height / 2 - (lines.length * fontSize) / 2;
            y -= canvas.height * 0.15;

            let lineHeight = fontSize * 1.5;

            while (y < 0 || y + lines.length * lineHeight > canvas.height) {
                fontSize -= 2;
                ctx.font = `${fontSize}px ${fontSelect}`;
                lineHeight = fontSize * 1.5;
                y = canvas.height / 2 - (lines.length * lineHeight) / 2;
                y -= canvas.height * 0.15;
            }

            lines.forEach(line => {
                ctx.fillText(line, canvas.width / 2, y);
                y += lineHeight;
            });

            document.getElementById('previewImage').src = canvas.toDataURL("image/png");
            document.getElementById('previewImage').style.display = 'block';
        };
        image.src = event.target.result;
    };
    reader.readAsDataURL(backgroundUpload);
}

function saveAsJPG() {
    const canvas = document.getElementById('invitationCanvas');
    const guestName1 = document.getElementById('guestName1').value;
    const invitationType = document.getElementById('invitationType').value;
    const fileName = `Հրավեր ${guestName1}.jpg`; 

    const link = document.createElement('a');
    link.download = fileName;
    link.href = canvas.toDataURL('image/jpeg', 1.0);
    link.click();
}
