from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from pymongo import MongoClient
# import cv_evaluator
import os
import requests
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from openai import OpenAI
import time
import json
from bson import ObjectId
from bson.json_util import dumps
# from assistant import *

app = Flask(__name__)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Load environment variables
load_dotenv()
    
# app = Flask(__name__)


# app = Flask(__name__)

# Load environment variables
load_dotenv()

# Configuration
API_KEY=os.getenv("API_KEY")
BASE_URL = os.getenv("BASE_URL")
UPLOAD_FOLDER=os.getenv('UPLOAD_FOLDER')
ASSISTANT_ID_CV=os.getenv('ASSISTANT_ID_CV_EVALUATOR')
ASSISTANT_ID_EQ_Q=os.getenv('ASSISTANT_EQ_Q_GENERATOR')
MONGO_DB_URI=os.getenv('MONGODB_URI')
DB_NAME=os.getenv('DB_NAME')
app.config["JWT_SECRET_KEY"]=os.getenv('JWT_SECRET_KEY')


if __name__ == '__app__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)



@app.route('/index')
def index():
    return 'Hi'

@app.route('/signup',methods=['POST','GET'])
def signup():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']
    
    if mongo.db.students.find_one({"phone": phone}):
        return jsonify({"message": "Phone number already registered"}), 400
    
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    mongo.db.students.insert_one({"phone": phone, "password": hashed_password,"profile":{"tasks": {
                "Uploading CV": False,
                "Completing the Profile": False,
                "Starting the EQ test": False,
                "Submit EQ test": False,
                "Selected/Rejected": False
            },"interviews":[]}})
    mongo.close()
    return jsonify({"message": "User created successfully"}), 201


@app.route('/login',methods=['POST','GET'])
def login():
    data = request.get_json()
    phone = data.get('phone')
    password = data.get('password')
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']
    
    student = mongo.db.students.find_one({"phone": phone})
    if student and bcrypt.check_password_hash(student['password'], password):
        access_token = create_access_token(identity=str(student['_id']))
        #returns access token
        return jsonify(access_token=access_token), 200

    mongo.close()
    
    return jsonify({"message": "Invalid credentials"}), 401

@app.route('/profile', methods=['GET', 'PUT'])
@jwt_required()
def profile():
    current_user_id = get_jwt_identity()
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']

    
    if request.method == 'GET':
        student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
        if student:
            print(student)
            return dumps({"profile": student.get('profile')}), 200
        return jsonify({"message": "User not found"}), 404
    
    elif request.method == 'PUT':
        data = request.get_json()
        print(data)
        profile_data = data
        
        # Validate and sanitize profile data here
        # allowed_fields = ['name', 'bio', 'location', 'birthdate']
        # sanitized_profile = {k: v for k, v in profile_data.items() if k in allowed_fields}
        
        result = mongo.db.students.update_one(
            {"_id": ObjectId(current_user_id)},
            {"$set": {"profile": profile_data}}
        )
        
        if result.modified_count:
            return jsonify({"message": "Profile updated successfully"}), 200
        return jsonify({"message": "No changes made to profile"}), 200


@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
    if student:
        return jsonify(logged_in_as=student['phone']), 200
    return jsonify({"message": "User not found"}), 404

@app.route('/upload', methods=['POST','GET'])
@jwt_required()
def upload_file_and_run_thread():
    current_user_id = get_jwt_identity()
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']
    
    if request.method == 'GET':
        student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
        if user:
            return dumps({"profile": student.get('profile', {})}), 200
        return jsonify({"message": "User not found"}), 404
    mongo.close()
    uploaded_file = request.files['file']
    
    client=OpenAI(api_key=API_KEY)

    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # file = open(app.config['UPLOAD_FOLDER']+uploaded_file.filename, 'w')
    # file.write(uploaded_file.stream)
    # file.close()

    filename = secure_filename(uploaded_file.filename)
    file_path=os.path.join(UPLOAD_FOLDER, uploaded_file.filename)
    uploaded_file.save(file_path)
    print(file_path)

    file = client.files.create(
        file=open(file_path, "rb"),
        purpose='assistants'
        )

    thread = client.beta.threads.create()

    message = client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content="Extract the details from the CV.",
        attachments= [ { "file_id": file.id, "tools": [{"type": "file_search"}] } ],
        # file_ids=[file.id],
        
    )
    run = client.beta.threads.runs.create(
    thread_id=thread.id,
    assistant_id=ASSISTANT_ID_CV)

    # run = 
        
    # print(run.status)
    # print(run)
    # print(run.status)

    # thread_messages = client.beta.threads.messages.list("thread_abc123")
    # for i in range(60):
    run_status = client.beta.threads.runs.retrieve(
        thread_id=thread.id,
        run_id=run.id
    )
    # print(run_status)

    for i in range(60):
        print(f"Waiting for response... ({i} seconds)")

        # get the latest run state
        result = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )

        if result.status == "requires_action": # run has executed
            # parse structured response from the tool call
            structured_response = json.loads(
        # fetch json from function arguments
                result.required_action.submit_tool_outputs.\
                    tool_calls[0].function.arguments
            )
            print(structured_response)
            break
            # return structured_response

        # wait 1 second before retry
        time.sleep(1)
        
    client.close()
    return structured_response

@app.route('/start-virtual-interview',methods=['POST','GET'])
@jwt_required()
def start_virtual_interview():
    current_user_id = get_jwt_identity()
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']

    if request.method == 'POST':
        client=OpenAI(api_key=API_KEY)
        thread = client.beta.threads.create()

        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content="Generate EQ Questions"    
        )
        run = client.beta.threads.runs.create(
        thread_id=thread.id,
        assistant_id=ASSISTANT_ID_EQ_Q)

        run_status = client.beta.threads.runs.retrieve(
            thread_id=thread.id,
            run_id=run.id
        )
        # print(run_status)

        for i in range(60):
            print(f"Waiting for response... ({i} seconds)")

            # get the latest run state
            result = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run.id
            )

            if result.status == "requires_action": 
                # run has executed
                # parse structured response from the tool call
                structured_response = json.loads(
            # fetch json from function arguments
                    result.required_action.submit_tool_outputs.\
                        tool_calls[0].function.arguments
                )
                print(structured_response)
                break
                # return structured_response

            # wait 1 second before retry
            time.sleep(1)
        client.close()
        structured_response["id"]=ObjectId()
        result = mongo.db.students.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$addToSet': {'interviews': structured_response}}
        )
        
        print(result)
        # result = mongo.db.students.update_one(,
        #     {"$set": {"interviews": structured_response}}
        # )
        print(structured_response)
        # return structured_response
        # isinstance(obj_id, ObjectId):
        # return str(obj_id)
        return {"interviewId":str(structured_response["id"])}

@app.route('/interview/<interviewId>/<questionId>',methods=['POST','GET'])
@jwt_required()
def interview(interviewId,questionId):
    current_user_id = get_jwt_identity()
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']
    questionId=int(questionId)
    print(questionId)

    
    if request.method == 'GET':
        print(interviewId)
        interviews="interviews"
        print(ObjectId(interviewId))
        # questionId=
        result = mongo.db.students.find_one(
        {"_id":ObjectId(current_user_id) , "interviews.id": ObjectId(interviewId)},
        {"interviews.$": 1}
        )
        if result and 'interviews' in result and len(result['interviews']) > 0:
            return {"id":str(result['interviews'][0]['id']),"eq_questions":result['interviews'][0]['eq_questions'][questionId]}
        print(result["interviews"])
        print(result[0]["eq_questions"][0]["question"])
        # return {"id":str(result["interviews"]["id"]),"eq_questions":result[0]["eq_questions"][0]["question"]}
        return {}
        print(result)
        

    
    # if request.method == 'POST':
    #     # if (not questionId==4):
    #     data = request.get_json()

    #     result = mongo.db.students.update_one(
    #         {'_id': ObjectId(current_user_id)},
    #         {'$addToSet': {'candidate_answers': data}}
    #     )
    #         # )
    #     # else:
    #     if (questionId==4):
    #         eq_score = 



    #     return {}
        

@app.route('/rate',methods=['POST','GET'])
@jwt_required()
def rate_students():
    current_user_id = get_jwt_identity()
    mongo = MongoClient(MONGO_DB_URI)
    db = mongo[DB_NAME]
    students=db['students']
    
    if request.method == 'GET':
        student = mongo.db.students.find_one({"_id": ObjectId(current_user_id)})
        if student:
            # 1. ITI trade condition
            iti_trade = next((edu["degree"] for edu in data.get("education", []) if "ITI" in edu.get("degree", "").upper()), None)
            if iti_trade and iti_trade.upper() not in ["ELECTRONICS", "ELECTRICAL"]:
                print(f"Candidate is not eligible due to ITI trade: {iti_trade}")
                return

            # 2. Parents' income condition
            parents_income = data.get("familyInfo", {}).get("parentsIncome", 0)
            if parents_income > 1500000:  # 15 lac in rupees
                print("Candidate is not eligible due to high parents' income.")
                return

            # 3. Parents' profession condition
            # parent_professions = [data.get("familyInfo", {}).get("fatherProfession"), 
            #                     data.get("familyInfo", {}).get("motherProfession")]
            # if any(prof in ["JUDGE", "IAS", "IPS"] for prof in parent_professions if prof):
            #     print("Candidate is not eligible due to parent's profession.")
            #     return

            # 4. IQ/EQ questions condition
            # iq_eq_score = data.get("testScores", {}).get("iqEqCorrect", 0)
            # if iq_eq_score <= 2:
            #     print("Candidate is not eligible due to low IQ/EQ score.")
            #     return

            # 5. 10th marks condition
            # tenth_marks = next((float(edu["percentage"]) for edu in data.get("education", []) 
            #                     if edu.get("degree", "").upper() == "HIGH SCHOOL"), None)
            # if tenth_marks is not None and tenth_marks > 80:
            #     print(f"Candidate is not eligible due to high 10th marks: {tenth_marks}%")
            #     return

            # print("Candidate is eligible based on all criteria.")
            #     # return dumps({"profile": student.get('profile', {})}), 200
            #     return jsonify({"message": "User not found"}), 404
            mongo.close()
            return dumps({"profile": student.get('profile', {})}), 200



@app.route('/logout')
def logout():
    return 'Logout'