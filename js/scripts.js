/*!
    Title: Dev Portfolio Template
    Version: 1.2.2
    Last Change: 03/25/2020
    Author: Ryan Fitzgerald
    Repo: https://github.com/RyanFitzgerald/devportfolio-template
    Issues: https://github.com/RyanFitzgerald/devportfolio-template/issues

    Description: This file contains all the scripts associated with the single-page
    portfolio website.
*/

(function($) {
    // Show current year
    $("#current-year").text(new Date().getFullYear());

    // Remove no-js class
    $('html').removeClass('no-js');

    // Animate to section when nav is clicked
    $('header a').click(function(e) {

        // Treat as normal link if no-scroll class
        if ($(this).hasClass('no-scroll')) return;

        e.preventDefault();
        var heading = $(this).attr('href');
        var scrollDistance = $(heading).offset().top;

        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, Math.abs(window.pageYOffset - $(heading).offset().top) / 1);

        // Hide the menu once clicked if mobile
        if ($('header').hasClass('active')) {
            $('header, body').removeClass('active');
        }
    });

    // Scroll to top
    $('#to-top').click(function() {
        $('html, body').animate({
            scrollTop: 0
        }, 500);
    });

    // Scroll to first element
    $('#lead-down span').click(function() {
        var scrollDistance = $('#lead').next().offset().top;
        $('html, body').animate({
            scrollTop: scrollDistance + 'px'
        }, 500);
    });

    // Create timeline
    $('#experience-timeline').each(function() {

        $this = $(this); // Store reference to this
        $userContent = $this.children('div'); // user content

        // Create each timeline block
        $userContent.each(function() {
            $(this).addClass('vtimeline-content').wrap('<div class="vtimeline-point"><div class="vtimeline-block"></div></div>');
        });

        // Add icons to each block
        $this.find('.vtimeline-point').each(function() {
            $(this).prepend('<div class="vtimeline-icon"><i class="fa fa-map-marker"></i></div>');
        });

        // Add dates to the timeline if exists
        $this.find('.vtimeline-content').each(function() {
            var date = $(this).data('date');
            if (date) { // Prepend if exists
                $(this).parent().prepend('<span class="vtimeline-date">'+date+'</span>');
            }
        });

    });

    // Open mobile menu
    $('#mobile-menu-open').click(function() {
        $('header, body').addClass('active');
    });

    // Close mobile menu
    $('#mobile-menu-close').click(function() {
        $('header, body').removeClass('active');
    });

    // Load additional projects
    $('#view-more-projects').click(function(e){
        e.preventDefault();
        $(this).fadeOut(300, function() {
            $('#more-projects').fadeIn(300);
        });
    });
    const firebaseConfig = {
        databaseURL: "https://hit-counter-thi-vo-default-rtdb.asia-southeast1.firebasedatabase.app/",
        apiKey: "AIzaSyA0DnVxVQNmHr1kry0Ip60CyTlU9QEJMsQ",
        authDomain: "hit-counter-thi-vo.firebaseapp.com",
        projectId: "hit-counter-thi-vo",
        storageBucket: "hit-counter-thi-vo.appspot.com",
        messagingSenderId: "963559412303",
        appId: "1:963559412303:web:de4190bcaa1290545e103a"
    };
    firebase.initializeApp(firebaseConfig);

    const hitCounter = document.getElementById("hit-counter");
    hitCounter.style.display = "none";
    const lastViewedOn = document.getElementById("last-viewed-on");
    lastViewedOn.style.display = "none";
    const db = firebase.database().ref("totalHit");
    db.on("value", (snapshot) => {
        hitCounter.textContent = snapshot.val()?.totalHits;
        const lastViewedOnFromServer = snapshot.val()?.lastViewedOn;
        if (lastViewedOnFromServer) {
            const convertedDate = new Date(lastViewedOnFromServer).toLocaleString("vn-VN", {timeZone: "Asia/Ho_Chi_Minh", hour12: false});
            lastViewedOn.textContent = convertedDate;
        }
    });
    const userCookieName = "returningVisitor";
    checkUserCookie(userCookieName);

    function checkUserCookie(userCookieName) {
        const regEx = new RegExp(userCookieName, "g");
        const cookieExists = document.cookie.match(regEx);
        if (cookieExists != null) {
            hitCounter.style.display = "inline";
            lastViewedOn.style.display = "inline";
        } else {
            createUserCookie(userCookieName);
            db.transaction(
                (totalHit) => {
                    const totalHits = totalHit?.totalHits || 0;
                    const lastViewedOn = new Date().toUTCString();
                    const newTotalHits = totalHits + 1;
                    return {
                        totalHits: newTotalHits,
                        lastViewedOn
                    }
                },
                (error) => {
                    if (error) {
                        console.log(error);
                    } else {
                        hitCounter.style.display = "inline";
                        lastViewedOn.style.display = "inline";
                    }
                }
            );
        }
    }

    function createUserCookie(userCookieName) {
        const userCookieValue = "Yes";
        const userCookieDays = 7;
        let expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + userCookieDays);
        document.cookie =
            userCookieName +
            "=" +
            userCookieValue +
            "; expires=" +
            expiryDate.toGMTString() +
            "path=/";
    }
})(jQuery, firebase);
