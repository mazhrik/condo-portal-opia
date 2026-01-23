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

    error_payload = {"message": message, "details": details}
    if code:
        error_payload["code"] = code

    response.data = {"error": error_payload}
    return response
