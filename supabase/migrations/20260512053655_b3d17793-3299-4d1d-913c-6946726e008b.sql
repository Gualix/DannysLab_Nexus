
ALTER FUNCTION public.validate_request_t15() SET search_path = public;
ALTER FUNCTION public.touch_updated_at() SET search_path = public;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.validate_request_t15() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

DROP POLICY "Public submit requests" ON public.service_requests;
CREATE POLICY "Public submit requests" ON public.service_requests
FOR INSERT WITH CHECK (
  status = 'pending'
  AND safety_agreed = true
  AND requested_date >= (CURRENT_DATE + INTERVAL '15 days')
  AND char_length(requester_name) BETWEEN 1 AND 200
  AND char_length(requester_email) BETWEEN 3 AND 320
);
