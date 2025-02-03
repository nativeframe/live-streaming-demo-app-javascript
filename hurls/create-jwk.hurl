POST {{HOST}}/auth/v1/jwks
Authorization: Bearer {{INTERNAL_JWT}}
Content-Type: application/json
{
	"alias": "JWT",
	"projectID": "{{PROJECT_ID}}",
	"disabled": false,
	"passive": false
}
