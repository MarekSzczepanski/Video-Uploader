const input = document.querySelector('input');
const label = document.querySelector('label');
const video = document.querySelector('video');

const upload_video = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const reader = new FileReader();
    const file = e.target.files[0];
    
    reader.addEventListener('loadend', (e) => {
        const buffer = e.target.result;
        const video_blob = new Blob([new Uint8Array(buffer)], { type: 'video/mp4' });
        const temporary_video_frontend_url = window.URL.createObjectURL(video_blob);
        const fd = new FormData();
        const body = document.body;
        const is_production = body.dataset.prod;

        manage_button_state('Uploading...', 'pending');
        body.dataset.hostname = window.location.hostname;

        const domain = body.dataset.hostname;

        fd.append('video', file, `${file.name}(^)${domain}`);

        fetch(is_production ? 'prodlink' : 'http://localhost:5000/video/', {
            method: 'POST',
            body: fd,
        }).then((data) => {
            setTimeout(() => {
                if (data.ok) {
                    manage_button_state('Uploaded!', 'done');

                    video.src = temporary_video_frontend_url;
    
                    setTimeout(() => {
                        manage_button_state('Upload', 'waiting');
                    }, 1000)
                } else {
                    alert ("Something went wrong");
                }
            }, 1000)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    })

    reader.readAsArrayBuffer(file);
}

const manage_button_state = (text, layout) => {
    label.textContent = text;
    label.className = layout;
}

input.addEventListener('change', (e) => upload_video(e));