SELECT reservations.*, properties.*, avg(property_reviews.rating)
FROM reservations
JOIN properties on reservations.property_id = properties.id
JOIN property_reviews on property_reviews.property_id = properties.id
WHERE end_date < now()::date
AND reservations.guest_id = 1
GROUP BY reservations.id, properties.id
ORDER BY start_date
LIMIT 10;