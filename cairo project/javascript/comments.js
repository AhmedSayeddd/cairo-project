document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 الصفحة جاهزة، تحميل التعليقات...");
    loadComments();

    document.body.addEventListener("change", function (event) {
        if (event.target.matches(".rating input")) {
            let ratingValue = event.target.value;
            let citySelect = document.getElementById('city-select');
            let placeName = citySelect ? citySelect.value : document.title;

            console.log("⭐ التقييم المختار:", ratingValue, "📍 المحافظة:", placeName);

            if (ratingValue) {
                openCommentBox(ratingValue, document.title, placeName);
            }
        }
    });
});

function openCommentBox(ratingValue, pageType, placeName) {
    console.log("✅ فتح صندوق التعليق...");
    closeCommentBox();

    let modal = document.createElement("div");
    modal.setAttribute("id", "commentModal");
    modal.innerHTML = `
        <div class="overlay" id="commentOverlay" onclick="closeCommentBox()" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); z-index: 1000;"></div>
        <div class="comment-box" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 20px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3); z-index: 1001; text-align: center; width: 350px; font-family: Arial, sans-serif;">
            <button onclick="closeCommentBox()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 22px; cursor: pointer;">✖</button>
            <h3 style="color: #333;">💬 أضف تعليقك</h3>
            <textarea id="commentText" placeholder="اكتب تعليقك هنا..." style="width: 100%; height: 80px; margin-bottom: 10px; border-radius: 10px; padding: 10px;"></textarea>
            <input type="file" id="commentImage" accept="image/*" multiple style="margin-bottom: 10px;">
            <div id="previewContainer" style="margin-top: 10px; display: flex; flex-wrap: wrap; gap: 10px;"></div>
            <br>
            <button id="submitCommentBtn" style="background: #007bff; color: white; padding: 10px 15px; border: none; border-radius: 10px; cursor: pointer;">إرسال</button>
        </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("commentImage").addEventListener("change", function () {
        let previewContainer = document.getElementById("previewContainer");
        previewContainer.innerHTML = "";
        Array.from(this.files).forEach(file => {
            let reader = new FileReader();
            reader.onload = function (e) {
                let img = document.createElement("img");
                img.src = e.target.result;
                img.style.maxWidth = "100px";
                img.style.maxHeight = "100px";
                img.style.borderRadius = "10px";
                img.style.cursor = "pointer";
                img.onclick = () => openFullImage(e.target.result);
                previewContainer.appendChild(img);
            };
            reader.readAsDataURL(file);
        });
        previewContainer.style.display = "flex";
    });

    document.getElementById("submitCommentBtn").addEventListener("click", function () {
        let commentText = document.getElementById("commentText").value.trim();
        let images = Array.from(document.getElementById("commentImage").files);
        let imageUrls = [];

        if (!commentText) {
            alert("❌ الرجاء إدخال تعليق!");
            return;
        }

        let storedComments = JSON.parse(localStorage.getItem("comments")) || [];

        let newComment = {
            userName: "مستخدم مجهول",
            userImage: "https://via.placeholder.com/50", 
            rating: ratingValue,
            commentText: commentText,
            location: placeName,
            imageUrl: ""
        };

        if (images.length > 0) {
            images.forEach(file => {
                let reader = new FileReader();
                reader.onload = function (e) {
                    imageUrls.push(e.target.result);
                    if (imageUrls.length === images.length) {
                        newComment.imageUrl = imageUrls[0];
                        storedComments.push(newComment);
                        localStorage.setItem("comments", JSON.stringify(storedComments));
                        closeCommentBox();
                        alert("✅ تم إرسال التعليق بنجاح!");
                        loadComments();
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            storedComments.push(newComment);
            localStorage.setItem("comments", JSON.stringify(storedComments));
            closeCommentBox();
            alert("✅ تم إرسال التعليق بنجاح!");
            loadComments();
        }
    });
}
function loadComments() {
    let commentSection = document.getElementById("comments-list");
    if (!commentSection) return;
    commentSection.innerHTML = "";

    let comments = JSON.parse(localStorage.getItem("comments")) || [];
    if (comments.length === 0) {
        commentSection.innerHTML = "<p class='text-center'>لا توجد تعليقات حتى الآن.</p>";
        return;
    }

    let commentsContainer = document.createElement("div");
    commentsContainer.classList.add("comments-container");
    commentsContainer.style.display = "flex";
    commentsContainer.style.overflow = "hidden";
    commentsContainer.style.whiteSpace = "nowrap";
    commentsContainer.style.transition = "transform 0.5s ease-in-out";

    comments.forEach((commentData) => {
        let commentCard = document.createElement("div");
        commentCard.classList.add("comment-card");
        commentCard.style.minWidth = "300px";
        commentCard.style.margin = "10px";
        commentCard.style.padding = "15px";
        commentCard.style.background = "#fff";
        commentCard.style.borderRadius = "10px";
        commentCard.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
        commentCard.innerHTML = `
            <div style="text-align: center;">
                <img src="${commentData.userImage}" alt="User Image" style="width: 50px; height: 50px; border-radius: 50%;">
                <h5>${commentData.userName}</h5>
            </div>
            <div class="rating" style="font-size: 20px; margin: 10px 0; color: gold;">
                ${"★".repeat(commentData.rating)}${"☆".repeat(5 - commentData.rating)}
            </div>
            <p>${commentData.commentText}</p>
            ${commentData.imageUrl ? `<img src="${commentData.imageUrl}" alt="صورة التعليق" style="max-width: 100%; border-radius: 10px; margin-top: 10px;">` : ""}
            <div style="color: #666; margin-top: 10px;">المحافظة: ${commentData.location}</div>
        `;
        commentsContainer.appendChild(commentCard);
    });

    commentsContainer.style.width = `${comments.length * 320}px`;
    commentSection.appendChild(commentsContainer);
    setTimeout(()=>startAutoScroll(commentsContainer,commentSection),500);
}


function startAutoScroll(commentsContainer, commentSection) {
    let position = 0;
    let direction = 1;
    let step = 320;
    let maxScroll = commentsContainer.scrollWidth - commentSection.clientWidth;

    if (maxScroll <= 0) return;

    setInterval(() => {
        if (position >= maxScroll) {
            direction = -1;
        } else if (position <= 0) {
            direction = 1;
        }

        position = Math.min(maxScroll, Math.max(0, position + step * direction));
        commentsContainer.style.transform = `translateX(${-position}px)`;
    }, 2000);
}
function closeCommentBox() {
    console.log("❌ إغلاق صندوق التعليق...");
    document.getElementById("commentModal")?.remove();
    document.getElementById("commentOverlay")?.remove();
}
