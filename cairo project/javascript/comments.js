    document.addEventListener("DOMContentLoaded", function () {
        console.log("📌 الصفحة جاهزة، تحميل التعليقات...");
        loadComments();

        // استخدام event delegation لتجنب مشاكل تحميل العناصر
        document.body.addEventListener("change", function (event) {
            if (event.target.matches(".rating input")) {
                let ratingValue = event.target.value;

                // التأكد من وجود المدينة وإلا استخدام عنوان الصفحة
                let citySelect = document.getElementById('city-select');
                let placeName = citySelect ? citySelect.value : document.title;

                console.log("⭐ التقييم المختار:", ratingValue, "📍 المحافظة:", placeName);

                if (ratingValue) {
                    openCommentBox(ratingValue, document.title, placeName);
                }
            }
        });
    });

    // دالة فتح صندوق التعليق
    function openCommentBox(ratingValue, pageType, placeName) {
        console.log("✅ فتح صندوق التعليق...");
        closeCommentBox();

        let modal = document.createElement("div");
        modal.setAttribute("id", "commentModal");
        modal.innerHTML = `
            <div class="overlay" id="commentOverlay" onclick="closeCommentBox()"></div>
            <div class="comment-box" style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background: white; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.3); z-index: 1001; text-align: center; width: 300px;">
                <button onclick="closeCommentBox()" style="position: absolute; top: 10px; right: 10px; background: none; border: none; font-size: 20px; cursor: pointer;">X</button>
                <h4>كومنت</h4>
                <textarea id="commentText" placeholder="اكتب تعليقك هنا..." style="width: 100%; height: 80px; margin-bottom: 10px;"></textarea>
                <br>
                <button id="submitCommentBtn" style="background: #007bff; color: white; padding: 10px; border: none; border-radius: 5px; cursor: pointer;">إرسال</button>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById("submitCommentBtn").addEventListener("click", function () {
            submitComment(ratingValue, pageType, placeName);
        });
    }

    // دالة إرسال التعليق وتحديث الصفحة تلقائيًا
    function submitComment(rating, pageType, placeName) {
        let commentText = document.getElementById("commentText").value.trim();
        if (!commentText) {
            alert("يرجى إدخال تعليق قبل الإرسال.");
            return;
        }

        let commentData = {
            userName: "مستخدم مجهول",
            userImage: "img/user.png",
            rating: rating,
            commentText: commentText,
            location: placeName
        };

        let comments = JSON.parse(localStorage.getItem("comments")) || [];
        comments.push(commentData);
        localStorage.setItem("comments", JSON.stringify(comments));

        loadComments();
        closeCommentBox();
    }

    // دالة تحميل التعليقات في صفحة الهوم مع تشغيل الأوتو سكرول
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
                <div style="color: #666;">المحافظة: ${commentData.location}</div>
            `;
            commentsContainer.appendChild(commentCard);
        });

        commentsContainer.style.width = `${comments.length * 320}px`;
        commentSection.appendChild(commentsContainer);
        setTimeout(() => startAutoScroll(commentsContainer, commentSection), 500);
    }

    // دالة الأوتو سكرول لليمين والشمال
    function startAutoScroll(commentsContainer, commentSection) {
        let position = 0;
        let direction = 1;
        let step = 320;
        let maxScroll = commentsContainer.scrollWidth - commentSection.clientWidth;

        if (maxScroll <= 0) return; // لا تتحرك إذا لم يكن هناك تعليقات كافية للتمرير

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

    // دالة إغلاق صندوق التعليق
    function closeCommentBox() {
        console.log("❌ إغلاق صندوق التعليق...");
        document.getElementById("commentModal")?.remove();
        document.getElementById("commentOverlay")?.remove();
    }
