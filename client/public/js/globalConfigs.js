window.config = {
    backendEndpoint: "https://platform.nativeframe.com", // The URL for the environment you plan to stream to
    // backendEndpoint: "https://dev2.devspace.lsea4.livelyvideo.tv", // The URL for the environment you plan to stream to
    serviceEndpoint: "http://localhost:3005", // The URL for the API service
    authType: "token", // The type of authentication you plan to use ([auth0 | token])
    auth0: {
        // domain: "dev-c7487lvy5pa6ai7i.us.auth0.com", // @lively
        domain: "dev-qmtcvt2r0hj025sh.us.auth0.com", // @nativeframe
        // clientId: "joLQM9sRA1CNKlgBdcMWYZH4eYGk152m", // @lively
        clientId: "A863msM4bjcBN7FU9U3oiu1yKYpmL7qR", // @nativeframe
    },
    // dev2
    // serviceJwt: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ3ZGIxZDkyLWEyNDQtNGQwMC04MWM3LTg3ZjlhMDU4ZDExOCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU0ODY2MzIsImlzcyI6ImRldjI_cHJvamVjdD0wMTkxYmYwNC0yYzNjLTcxNmQtYTJkZS00ZDgyOGY5NzFmZDQiLCJqdGkiOiJjcmNkY2ExYmgwZjhmMXFiY2d2MCIsInJvbGVzIjpbInNlcnZpY2UtYWNjb3VudCJdfQ.EMHibNKaKV5uDsqABF8RqD8652ANp1Ctp1aQx_KCiSOcb1u4mTLKdzqNqJRfQFgmBFBZmwgKQYraYYKXyyBQg8jWAs2jUhQvnJ10fmZquOQtSWpyQEciRjqcssdnbCqGwaY1h0QDZQ7twt0y0ybFpeH_Hf9NAJXQIM4DrA0t5eCv9UDopwli84uvHVgjWxxu5BytE1yDI-smeotNDsp2TJhKKgBzPj3BQCvu-m_Hy_lKaQjtcQJv-_nmE0uAv45Mo-9UUgNt0w5rWQGha-50auHfL8b0FRh_Wgj6unY_uudKvke51wR_ppDxl90vtLS3PUN2dgyk3K8k_rgKejpiow',
    //prod
    serviceJwt: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjMwZjRiMTk5LTg2YmYtNGJlOC04NWVjLWNkMzYzMjYwNmJiZCIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1NTg2MDIsImlzcyI6Im5hdGl2ZWZyYW1lP3Byb2plY3Q9MDE5MWI5ZDItZjhjZC03N2U4LWFmNDItYzQ2NTg1ZDBjZDA1IiwianRpIjoiY3JjdXVpa2I4dW1zNzNmc2FyMGciLCJyb2xlcyI6WyJzZXJ2aWNlLWFjY291bnQiXX0.wkHlHhmNRZaJHDCsh16L5eqS8KxEV_XyHfyA1hhm6JXBaDP7EsXnZgKjzPo_ivrsAg3v_CYc7vCaw2TEsxBw1Fdf2DE7oX6F8vpYW8yrcjtEE3qNIqYOr1_Xy2Lr5qvnvpD_RqEhPMZ7aTej22kOhSszA4OaJ8BqtBQhf-yFFT7gsmGhElf0va4XWeNJUO8tARRs0edzR6eAePYQCNbzCHr3TMfnNCWxTeJFaG2gxr69w6iUjq98Bg2FhPvpkGBmudXK2xRmfLegLl22efnxN8Kf9mhU_KLc1Bw7aYxkPMJua75jAzffLbrUvAifpMTzHDFBEhzcPA8oTxmZXT19uQ',
    // videoJwt: 'eyJhbGciOiJSUzI1NiIsImtpZCI6ImNkZDc0MjQ1LWQzNTktNGVlZS04OTc1LTUzNTAzODNhZTIyZCIsInR5cCI6IkpXVCJ9.eyJAdmlkZW8vdG9rZW4iOnsiYWNjZXNzSWRzIjpbXSwiYWRtaW4iOmZhbHNlLCJkYXRhIjp7ImRpc3BsYXlOYW1lIjoiTmF0aXZlIEZyYW1lIERldiIsIm1pcnJvcnMiOltdfSwiZXhwaXJlIjoiMjAyNC0wOS0wNFQyMzoxNToyMS4xMTg5MTc3MzdaIiwic2NvcGVzIjpbImJyb2FkY2FzdGVyIl0sInRva2VuIjoiNTQzMTJhNTA2NjZlNDY2MjlmNDg3YmM1ZmM4NWQxODkiLCJ1c2VySWQiOiIyNzQ0ZmRlZi03OWMxLTQ1YjktODM0ZS1kY2U5ZTUzMmZmZjEifSwiZXhwIjoxNzI1NDkxNzIxLCJpYXQiOjE3MjU0OTAyODEsImlzcyI6ImRldjI_cHJvamVjdD0wMTkxYmYwNC0yYzNjLTcxNmQtYTJkZS00ZDgyOGY5NzFmZDQiLCJqdGkiOiJjcmNlOHE5YmgwZjhmMXFiY2g1MCIsInJvbGVzIjpbIiIsInVzZXIiXSwic3ViIjoiMjc0NGZkZWYtNzljMS00NWI5LTgzNGUtZGNlOWU1MzJmZmYxIn0.GC3VJFZBOVdwXAt0Qyiv3jxjdYumysQfXoyz91EGnbOZHTgMouugVrIItpEuC4DAXEpcSFPhfj6c9---3vI13dV7_FmRD0nl8cDeNndJdTgpidWVGweFJM6L5GnNSz3GvD7zz9bjPz3DaivUct1B9cZY-otk0Py9ulvAIH_HroYmGl5rSTTEs26bgRLhY-JNcYlnGZZ2nnlOu39wVfYK9JihtaIX4KPvjUmNJviEanqp-3S_e4VyADnYkoRuTGWYa65Ww6pRkBf2p-4BJQ6xv9OH9qUyid15N8e7K1cSWYR_27Bntb16qFSd1VoPGLv4fP8O9LbhEiLfwZyBdVCvTw',
    // projectId: '0191bf04-2c3c-716d-a2de-4d828f971fd4' // dev2
    projectId: '0191b9d2-f8cd-77e8-af42-c46585d0cd05' // prod
};