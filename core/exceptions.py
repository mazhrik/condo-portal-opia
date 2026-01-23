from rest_framework.views import exception_handler


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response

    details = response.data
    message = "Request failed"
    code = None

    if isinstance(details, dict):
        if "detail" in details:
            message = details.get("detail")
            code = details.get("code")
        elif "non_field_errors" in details and details["non_field_errors"]:
            message = details["non_field_errors"][0]
        else:
            message = "Validation error"
    elif isinstance(details, list) and details:
        message = details[0]

    if code is None:
        code = "error"

    if isinstance(details, list):
        details_payload = {"errors": details}
    elif isinstance(details, dict):
        details_payload = details
    else:
        details_payload = {}

    error_payload = {"code": code, "message": message, "details": details_payload}

    response.data = {"error": error_payload}
    return response
