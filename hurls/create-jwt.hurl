POST {{HOST}}/auth/v1/jwt
Authorization: Bearer {{INTERNAL_JWT}}
Content-Type: application/json
X-Project-ID: "{{PROJECT_ID}}"
{
	"kid": "{{KID}}",
	"ttl": 1000000,
	"roles": ["conference-owner"],
	"sub": "commentator-{{POS}}",
	"claims": {
		"@video/appData": {
			"broadcast_name": "fake_stream",
			"commentator": "true",
			"scope": "conference-owner",
			"pos": {{POS}},
			"displayName": "commentator-{{POS}}",
			"userId": "commentator-{{POS}}"
		}
	}
}
