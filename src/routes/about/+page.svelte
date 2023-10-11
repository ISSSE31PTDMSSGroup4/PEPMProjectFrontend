<script>
    let teamMembers = [
        {
            name: "LEOW YONG JIE",
            avatar:
                "https://bootstrapious.com/i/snippets/sn-about/avatar-1.png",
        },
        {
            name: "SHAJINI HUBERT",
            avatar:
                "https://bootstrapious.com/i/snippets/sn-about/avatar-4.png",
        },
        {
            name: "WANG CHENG",
            avatar:
                "https://bootstrapious.com/i/snippets/sn-about/avatar-3.png",
        },
        {
            name: "YIP KWOK CHUO WILLIS",
            avatar:
                "https://bootstrapious.com/i/snippets/sn-about/avatar-1.png",
        },
        {
            name: "ZENG XIANHAN",
            avatar:
                "https://bootstrapious.com/i/snippets/sn-about/avatar-2.png",
        },
    ];
</script>

<div class="bg-light py-5">
    <div class="container py-5">
        <div class="row mb-4">
            <div class="col-lg-5">
                <h5 class="display-4 font-weight-light">About Team 8</h5>
                <p class="font-italic text-muted">
                    Architecting Scalable Systems Practise Module
                </p>
            </div>
        </div>

        <div class="row text-center">
            {#each teamMembers as member}
                <!-- Team item-->
                <div class="col-xl-4 col-sm-6 mb-5">
                    <div class="bg-white rounded shadow-sm py-5 px-4">
                        <img
                            src={member.avatar}
                            alt=""
                            width="100"
                            class="img-fluid rounded-circle mb-3 img-thumbnail shadow-sm"
                        />
                        <h5 class="mb-0">{member.name}</h5>
                        <span class="small text-uppercase text-muted"
                            >Team 8 Member</span
                        >
                    </div>
                </div>
                <!-- End-->
            {/each}
        </div>
    </div>
</div>

