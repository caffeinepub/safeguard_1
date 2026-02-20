import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";



actor {
  include MixinStorage();

  type ChecklistItem = {
    name : Text;
    completed : Bool;
    photo : ?Storage.ExternalBlob;
  };

  type Submission = {
    storeName : Text;
    items : [ChecklistItem];
    timestamp : Time.Time;
  };

  let submissions = Map.empty<Principal, Submission>();

  public shared ({ caller }) func submitChecklist(storeName : Text, items : [ChecklistItem]) : async () {
    let submission : Submission = {
      storeName;
      items;
      timestamp = Time.now();
    };

    submissions.add(caller, submission);
  };

  public query ({ caller }) func getSubmission(user : Principal) : async Submission {
    switch (submissions.get(user)) {
      case (null) { Runtime.trap("No submission found") };
      case (?submission) { submission };
    };
  };

  public query ({ caller }) func getAllSubmissions() : async [Submission] {
    let valuesIter = submissions.values();
    valuesIter.toArray();
  };
};
