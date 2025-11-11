from django.shortcuts import render

def matter_list(request):
    matters = [
        {
            "activity": "Retainer Agreement Signed",
            "date": "7/4/2020",
            "status": "Completed",
            "assignee": "Joanna Miles",
        },
        {
            "activity": "Setup Mediation",
            "date": "7/2/2020",
            "status": "In Progress",
            "assignee": "Steve Miller",
        },
        {
            "activity": "Draft Documents",
            "date": "6/30/2020",
            "status": "Overdue",
            "assignee": "Joe Smith",
        },
    ]

    total = len(matters)
    completed = sum(1 for m in matters if m["status"] == "Completed")
    overdue = sum(1 for m in matters if m["status"] == "Overdue")
    not_completed = total - completed   # everything that’s not completed

    summary = {
        "all": total,
        "completed": completed,
        "not_completed": not_completed,
        "overdue": overdue,
    }

    return render(
        request,
        "matters/matter_list.html",
        {"matters": matters, "summary": summary},
    )
