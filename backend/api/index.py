import json
import os
import psycopg
from psycopg.rows import dict_row

DATABASE_URL = os.environ.get("DATABASE_URL")

def get_db():
    return psycopg.connect(DATABASE_URL, row_factory=dict_row)

def handler(request):
    # Handle both dict and list formats
    if isinstance(request, list):
        request = request[0] if request else {}
    method = request.get("method", "GET")
    path = request.get("path", "/")
    body = request.get("body", {})
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except:
            body = {}

    # CORS headers
    headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if method == "OPTIONS":
        return {"statusCode": 200, "headers": headers, "body": ""}

    try:
        # Route: GET /goals
        if method == "GET" and path == "/goals":
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM national_goals ORDER BY id")
                    goals = cur.fetchall()
            return {"statusCode": 200, "headers": headers, "body": json.dumps(goals, ensure_ascii=False, default=str)}

        # Route: GET /goals/{id}
        if method == "GET" and path.startswith("/goals/") and len(path.split("/")) == 3:
            goal_id = path.split("/")[2]
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT * FROM national_goals WHERE id = %s", (goal_id,))
                    goal = cur.fetchone()
                    cur.execute("SELECT * FROM goal_indicators WHERE goal_id = %s", (goal_id,))
                    indicators = cur.fetchall()
            if not goal:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
            goal["indicators"] = indicators
            return {"statusCode": 200, "headers": headers, "body": json.dumps(goal, ensure_ascii=False, default=str)}

        # Route: GET /projects
        if method == "GET" and path == "/projects":
            params = request.get("queryStringParameters") or {}
            category = params.get("category")
            region = params.get("region")
            goal_id = params.get("goal_id")
            status = params.get("status")
            search = params.get("search")

            query = "SELECT * FROM regional_projects WHERE 1=1"
            args = []
            if category:
                query += " AND category = %s"
                args.append(category)
            if region:
                query += " AND region ILIKE %s"
                args.append(f"%{region}%")
            if goal_id:
                query += " AND goal_id = %s"
                args.append(goal_id)
            if status:
                query += " AND status = %s"
                args.append(status)
            if search:
                query += " AND (title ILIKE %s OR description ILIKE %s OR region ILIKE %s)"
                args.extend([f"%{search}%", f"%{search}%", f"%{search}%"])
            query += " ORDER BY rating DESC, created_at DESC"

            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(query, args)
                    projects = cur.fetchall()
            return {"statusCode": 200, "headers": headers, "body": json.dumps(projects, ensure_ascii=False, default=str)}

        # Route: GET /projects/{id}
        if method == "GET" and path.startswith("/projects/") and len(path.split("/")) == 3:
            proj_id = path.split("/")[2]
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT p.*, g.title as goal_title, g.icon as goal_icon FROM regional_projects p LEFT JOIN national_goals g ON p.goal_id = g.id WHERE p.id = %s", (proj_id,))
                    project = cur.fetchone()
            if not project:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
            return {"statusCode": 200, "headers": headers, "body": json.dumps(project, ensure_ascii=False, default=str)}

        # Route: GET /forum/topics
        if method == "GET" and path == "/forum/topics":
            params = request.get("queryStringParameters") or {}
            category = params.get("category")
            goal_id = params.get("goal_id")
            search = params.get("search")

            query = """
                SELECT t.*, 
                  (SELECT COUNT(*) FROM forum_replies r WHERE r.topic_id = t.id) as reply_count,
                  g.title as goal_title
                FROM forum_topics t
                LEFT JOIN national_goals g ON t.goal_id = g.id
                WHERE 1=1
            """
            args = []
            if category:
                query += " AND t.category = %s"
                args.append(category)
            if goal_id:
                query += " AND t.goal_id = %s"
                args.append(goal_id)
            if search:
                query += " AND (t.title ILIKE %s OR t.content ILIKE %s)"
                args.extend([f"%{search}%", f"%{search}%"])
            query += " ORDER BY t.pinned DESC, t.created_at DESC"

            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(query, args)
                    topics = cur.fetchall()
            return {"statusCode": 200, "headers": headers, "body": json.dumps(topics, ensure_ascii=False, default=str)}

        # Route: GET /forum/topics/{id}
        if method == "GET" and path.startswith("/forum/topics/") and len(path.split("/")) == 4:
            topic_id = path.split("/")[3]
            with get_db() as conn:
                with conn.cursor() as cur:
                    # Increment views
                    cur.execute("UPDATE forum_topics SET views = views + 1 WHERE id = %s RETURNING *", (topic_id,))
                    topic = cur.fetchone()
                    if topic:
                        cur.execute("SELECT * FROM forum_replies WHERE topic_id = %s ORDER BY created_at ASC", (topic_id,))
                        replies = cur.fetchall()
                    conn.commit()
            if not topic:
                return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Not found"})}
            topic["replies"] = replies
            return {"statusCode": 200, "headers": headers, "body": json.dumps(topic, ensure_ascii=False, default=str)}

        # Route: POST /forum/topics
        if method == "POST" and path == "/forum/topics":
            title = body.get("title", "").strip()
            content = body.get("content", "").strip()
            author_name = body.get("author_name", "Аноним").strip()
            category = body.get("category", "Общее")
            goal_id = body.get("goal_id")
            if not title or not content:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "title and content required"})}
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO forum_topics (title, content, author_name, category, goal_id) VALUES (%s, %s, %s, %s, %s) RETURNING *",
                        (title, content, author_name, category, goal_id if goal_id else None)
                    )
                    topic = cur.fetchone()
                    conn.commit()
            return {"statusCode": 201, "headers": headers, "body": json.dumps(topic, ensure_ascii=False, default=str)}

        # Route: POST /forum/topics/{id}/replies
        if method == "POST" and path.startswith("/forum/topics/") and path.endswith("/replies"):
            parts = path.split("/")
            topic_id = parts[3]
            author_name = body.get("author_name", "Аноним").strip()
            content = body.get("content", "").strip()
            if not content:
                return {"statusCode": 400, "headers": headers, "body": json.dumps({"error": "content required"})}
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "INSERT INTO forum_replies (topic_id, author_name, content) VALUES (%s, %s, %s) RETURNING *",
                        (topic_id, author_name, content)
                    )
                    reply = cur.fetchone()
                    conn.commit()
            return {"statusCode": 201, "headers": headers, "body": json.dumps(reply, ensure_ascii=False, default=str)}

        # Route: POST /forum/topics/{id}/like
        if method == "POST" and path.startswith("/forum/topics/") and path.endswith("/like"):
            parts = path.split("/")
            topic_id = parts[3]
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("UPDATE forum_topics SET likes = likes + 1 WHERE id = %s RETURNING likes", (topic_id,))
                    result = cur.fetchone()
                    conn.commit()
            return {"statusCode": 200, "headers": headers, "body": json.dumps(result, ensure_ascii=False, default=str)}

        # Route: POST /calculator
        if method == "POST" and path == "/calculator":
            profession = body.get("profession", "")
            region = body.get("region", "")
            tax_paid = body.get("tax_paid", 0)
            volunteer_hours = body.get("volunteer_hours", 0)
            children = body.get("children", 0)
            education_level = body.get("education_level", "")
            total_score = body.get("total_score", 0)
            goals_impact = body.get("goals_impact", {})

            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        """INSERT INTO calculator_submissions 
                        (profession, region, tax_paid, volunteer_hours, children, education_level, total_score, goals_impact)
                        VALUES (%s, %s, %s, %s, %s, %s, %s, %s) RETURNING id""",
                        (profession, region, tax_paid, volunteer_hours, children, education_level, total_score, json.dumps(goals_impact))
                    )
                    result = cur.fetchone()
                    conn.commit()
            return {"statusCode": 201, "headers": headers, "body": json.dumps({"id": result["id"], "saved": True}, ensure_ascii=False)}

        # Route: GET /stats
        if method == "GET" and path == "/stats":
            with get_db() as conn:
                with conn.cursor() as cur:
                    cur.execute("SELECT COUNT(*) as total_goals FROM national_goals")
                    goals_count = cur.fetchone()
                    cur.execute("SELECT COUNT(*) as total_projects FROM regional_projects")
                    projects_count = cur.fetchone()
                    cur.execute("SELECT COUNT(*) as total_topics FROM forum_topics")
                    topics_count = cur.fetchone()
                    cur.execute("SELECT SUM(participants) as total_participants FROM regional_projects")
                    participants = cur.fetchone()
                    cur.execute("SELECT COUNT(*) as total_calcs FROM calculator_submissions")
                    calcs_count = cur.fetchone()
            stats = {
                "goals": goals_count["total_goals"],
                "projects": projects_count["total_projects"],
                "forum_topics": topics_count["total_topics"],
                "participants": int(participants["total_participants"] or 0),
                "calculators": calcs_count["total_calcs"],
            }
            return {"statusCode": 200, "headers": headers, "body": json.dumps(stats, ensure_ascii=False)}

        return {"statusCode": 404, "headers": headers, "body": json.dumps({"error": "Route not found"})}

    except Exception as e:
        return {"statusCode": 500, "headers": headers, "body": json.dumps({"error": str(e)})}